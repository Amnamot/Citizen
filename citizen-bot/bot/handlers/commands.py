import os
from aiogram import types, Dispatcher
from bot.db.models import get_user, create_user
from bot.keyboards import welcome_keyboard, getpassport_keyboard, wallet_keyboard, donate_keyboard
from bot.states import WelcomeStates, WalletStates, WithdrawStates
from aiogram.dispatcher import FSMContext
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from bot.db.models import User
from bot.common import cb_wallet
from aiogram.dispatcher.filters import Text
from tonsdk.contract.wallet import WalletVersionEnum, Wallets




async def cmd_start(message: types.Message, state: FSMContext):

    db_session = message.bot.get("db")
    
    await state.set_state(WelcomeStates.waiting_click_btn)

    user = await get_user(message.chat.id, db_session)

    if user:
        if user.username != message.chat.username:
            async with db_session() as session:
                user: User = await session.get(User, message.chat.id)
                user.username = message.chat.username
                await session.commit()
        if user.ispassport:
            await message.answer("We are pleased to welcome you!\nYou can now do the following:", reply_markup=welcome_keyboard(user.payed))
        else:
            await message.answer("We are pleased to welcome you!\nYou do not have a passport yet.\nIn the web 3.0 world you will definitely need one.", reply_markup=getpassport_keyboard())
    else:
        await create_user(message.chat.id, message.chat.username, db_session)
        await message.answer("We are pleased to welcome you!\nYou do not have a passport yet.\nIn the web 3.0 world you will definitely need one.", reply_markup=getpassport_keyboard())


async def my_passport(message: types.Message):
    await message.answer("We passport", reply_markup=InlineKeyboardMarkup().add(InlineKeyboardButton("Open passport", web_app=WebAppInfo(url=f'{os.getenv("api_url")}?id={message.chat.id}&username={message.chat.username}'))))

async def social(message: types.Message):
    await message.answer("If you know this user, you can confirm this social connection by going to your passport or ignore", reply_markup=InlineKeyboardMarkup().add(InlineKeyboardButton("Open passport", web_app=WebAppInfo(url=f'{os.getenv("api_url")}?id={message.chat.id}&username={message.chat.username}'))))

async def wallet(message: types.Message, state: FSMContext):
    await state.set_state(WalletStates.waiting_click_btn)
    await message.answer(f"Your balance is", reply_markup=wallet_keyboard())


async def deposit(call: types.CallbackQuery):
    db_session = call.message.bot.get("db")
    user = await get_user(call.message.chat.id, db_session)
    await call.message.answer(f"To top up send ton to this address: `{user.address}`", parse_mode="Markdown")

async def withdraw(message: types.CallbackQuery):
    await message.answer(f"Your balance ", reply_markup=wallet_keyboard())

async def donate(message: types.Message):
    await message.answer("Help the project by donating the desired amount of ton", reply_markup=donate_keyboard())

def register_commands(dp: Dispatcher):
    dp.register_message_handler(cmd_start, commands="start", state="*")
    dp.register_message_handler(my_passport, (Text(equals="View my passport 🪪")), state=WelcomeStates.waiting_click_btn)
    dp.register_message_handler(social, (Text(contains="The user with the username")), state="*")
    dp.register_message_handler(wallet, (Text(equals="Wallet 💎")), state="*")
    dp.register_message_handler(donate, (Text(equals="Donate 🎁")), state="*")

    dp.register_callback_query_handler(deposit, cb_wallet.filter(btn="deposit"), state=WalletStates.waiting_click_btn)
    dp.register_callback_query_handler(withdraw, cb_wallet.filter(btn="withdraw"), state=WalletStates.waiting_click_btn)
    
