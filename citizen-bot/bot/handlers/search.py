import os
from aiogram import Dispatcher, types
from aiogram.dispatcher import FSMContext
from bot.db.models import User
from bot.states import SearchStates
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from bot.common import cb_common_btn


async def search_input(message: types.Message):
    db_session = message.bot.get("db")


    async with db_session() as session:
        user: User = await session.get(User, message.chat.username)

    await message.answer(message.chat.username, reply_markup=InlineKeyboardMarkup().add(InlineKeyboardButton("GO", web_app=WebAppInfo(url=f'{os.getenv("WEBAPP_URL")}index.html?another_id={user.telegram_id}'))))


def register_search(dp: Dispatcher):
    dp.register_message_handler(search_input, commands=None, content_types=types.ContentTypes.TEXT, state=SearchStates.input_username)