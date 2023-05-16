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
from aiogram.dispatcher.filters import Text

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


async def my_passport(message: types.Message):
    await message.answer("We passport", reply_markup=InlineKeyboardMarkup().add(InlineKeyboardButton("GO", web_app=WebAppInfo(url=f'{os.getenv("api_url")}?id={message.chat.id}'))))




def register_commands(dp: Dispatcher):
    dp.register_message_handler(cmd_start, commands="start", state="*")
    dp.register_message_handler(my_passport, (Text(equals="View my passport 🪪")), state=WelcomeStates.waiting_click_btn)