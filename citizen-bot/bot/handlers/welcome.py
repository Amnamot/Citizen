import json
import os
from aiogram import Dispatcher, types
from bot.common import cb_welcome
from aiogram.dispatcher import FSMContext
from bot.states import SearchStates, WelcomeStates
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
import aiohttp
from bot.utils.aes import encryptAES


async def my_passport(message: types.Message):
    async with aiohttp.ClientSession() as session:
        async with session.get(f'{os.getenv("api_url")}/api/v1/getNFT/{message.chat.id}') as resp:
            response = await resp.read()
    if resp.status == 200:
        data = json.loads(response.decode())
        await message.answer("We passport", reply_markup=InlineKeyboardMarkup().add(InlineKeyboardButton("GO", web_app=WebAppInfo(url=f'{os.getenv("WEBAPP_URL")}index.html?nft_address={encryptAES(data["nft_address"])}&content={data["content"]}&owner={data["owner"]}'))))

        


async def another_passport(message: types.Message, state: FSMContext):
    await state.set_state(SearchStates.input_username)
    await message.answer("Enter username to search")


async def pay_premium(message: types.Message, state: FSMContext):
    await message.answer("Comming Soon")

def register_welcome(dp: Dispatcher):
    dp.register_callback_query_handler(my_passport, cb_welcome.filter(btn="my passport"), state=WelcomeStates.waiting_click_btn)
    dp.register_callback_query_handler(another_passport, cb_welcome.filter(data="another passport"), state=WelcomeStates.waiting_click_btn)
    dp.register_callback_query_handler(pay_premium, cb_welcome.filter(data="pay premium"), state=WelcomeStates.waiting_click_btn)