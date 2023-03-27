import json
import os
from aiogram import types, Dispatcher
import aiohttp
from bot.db.models import get_user, create_user
from bot.keyboards import welcome_keyboard, getpassport_keyboard, wallet_keyboard
from bot.states import WelcomeStates, SearchStates
from aiogram.dispatcher import FSMContext
from bot.states import WalletStates
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from bot.db.models import User
from bot.utils.aes import encryptAES


async def cmd_start(message: types.Message, state: FSMContext):
    db_session = message.bot.get("db")
    
    await state.set_state(WelcomeStates.waiting_click_btn)

    user = await get_user(message.chat.id, db_session)

    if user:
        if user.username != message.chat.username:
            async with db_session() as session:
                user: User = await session.get(User, message.chat.id)
                user.username = message.chat.id
                await session.commit()
        if user.ispassport:
            await message.answer("We are pleased to welcome you!\nYou can now do the following:", reply_markup=welcome_keyboard(user.payed))
        else:
            await message.answer("We are pleased to welcome you!\nYou do not have a passport yet.\nIn the web 3.0 world you will definitely need one.", reply_markup=getpassport_keyboard())
    else:
        await create_user(message.chat.id, message.chat.username, db_session)
        await message.answer("We are pleased to welcome you!\nYou do not have a passport yet.\nIn the web 3.0 world you will definitely need one.", reply_markup=getpassport_keyboard())


async def cmd_wallet(message: types.Message, state: FSMContext):
    await state.set_state(WalletStates.waiting_click_btn)
    async with aiohttp.ClientSession() as session:
        async with session.get(f'{os.getenv("api_url")}/api/v1/getbalance/{message.chat.id}') as resp:
            if resp.status == 200:
                response = await resp.read()
                await message.answer(f"Your balance is {response.decode().strip()[1:-1]} TON", reply_markup=wallet_keyboard())


async def cmd_faq(message: types.Message):
    await message.answer("FAQ", reply_markup=InlineKeyboardMarkup().add(InlineKeyboardButton("FAQ", web_app=WebAppInfo(url=f'{os.getenv("WEBAPP_URL")}FAQ.html'))))


async def cmd_my(message: types.Message):
    db_session = message.bot.get("db")

    user = await get_user(message.chat.id, db_session)

    if user:
        if user.ispassport:
            async with aiohttp.ClientSession() as session:
                async with session.get(f'{os.getenv("api_url")}/api/v1/getNFT/{message.chat.id}') as resp:
                    response = await resp.read()
            if resp.status == 200:
                data = json.loads(response.decode())
                await message.answer("We passport", reply_markup=InlineKeyboardMarkup().add(InlineKeyboardButton("GO", web_app=WebAppInfo(url=f'{os.getenv("WEBAPP_URL")}index.html?nft_address={data["nft_address"]}&content={data["content"]["URI"]}&owner={data["owner"]}'))))

        else:
            await message.answer("We are pleased to welcome you!\nYou do not have a passport yet.\nIn the web 3.0 world you will definitely need one.", reply_markup=getpassport_keyboard())
    else:
        await create_user(message.chat.id, message.chat.username, db_session)
        await message.answer("We are pleased to welcome you!\nYou do not have a passport yet.\nIn the web 3.0 world you will definitely need one.", reply_markup=getpassport_keyboard())


async def cmd_search(message: types.Message, state: FSMContext):
    await state.set_state(SearchStates.input_username)
    await message.answer("Enter username to search")


async def cmd_premium(message: types.Message, state: FSMContext):
    await message.answer("Comming Soon")


async def cmd_edit(message: types.Message, state: FSMContext):
    await message.answer("Comming Soon")


async def cmd_donate(message: types.Message, state: FSMContext):
    await message.answer("Comming Soon")




def register_commands(dp: Dispatcher):
    dp.register_message_handler(cmd_start, commands="start", state="*")
    dp.register_message_handler(cmd_wallet, commands="wallet", state="*")
    dp.register_message_handler(cmd_faq, commands="faq", state="*")
    dp.register_message_handler(cmd_my, commands="my", state="*")
    dp.register_message_handler(cmd_search, commands="search", state="*")
    dp.register_message_handler(cmd_premium, commands="premium", state="*")
    dp.register_message_handler(cmd_edit, commands="edit", state="*")
    dp.register_message_handler(cmd_donate, commands="donate", state="*")
    