import os
from aiogram import types, Dispatcher
import aiohttp
from bot.db.models import get_user
from bot.handlers.commands import cmd_wallet
from bot.keyboards import cancel_keyboard, wallet_keyboard
from bot.states import WalletStates, WithdrawStates
from aiogram.dispatcher import FSMContext
from bot.states import WalletStates
from tonsdk.contract.wallet import WalletVersionEnum, Wallets
from bot.common import cb_wallet, cb_common_btn
from tonsdk.provider import prepare_address
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from bot.utils.aes import encryptAES

async def deposit(call: types.CallbackQuery):
    db_session = call.message.bot.get("db")
    user = await get_user(call.message.chat.id, db_session)
    seed = user.seed.split(" ")
    wallet = Wallets.from_mnemonics(seed, WalletVersionEnum.v3r2, 0)
    await call.message.answer(f"To top up send ton to this address: `{wallet[3].address.to_string(True, True, True)}`", parse_mode="Markdown")


async def withdraw(call: types.CallbackQuery, state: FSMContext):
    async with aiohttp.ClientSession() as session:
        async with session.get(f'http://127.0.0.1:8000/api/v1/getbalance/{call.message.chat.id}') as resp:
            if resp.status == 200:
                response = await resp.read()
                if response.decode().strip()[1:-1] == '0':
                    await call.message.answer("Minimum withdraw 0.1 TON")
                else:
                    await state.set_state(WithdrawStates.amount_input)
                    await call.message.answer("How much do you want to withdraw:", reply=cancel_keyboard())


async def amount_input(message: types.Message, state: FSMContext):
    if message.text.find(".") == -1:
        if message.text[0] != '0':
            async with aiohttp.ClientSession() as session:
                async with session.get(f'http://127.0.0.1:8000/api/v1/getbalance/{message.chat.id}') as resp:
                    if resp.status == 200:
                        response = await resp.read()
                        if float(response.decode().strip()[1:-1]) >= float(message.text):
                            await state.set_state(WithdrawStates.wallet_input)
                            await state.update_data(amount=message.text)
                            await message.answer("Enter wallet address:", reply_markup=cancel_keyboard())
                        else:
                            await message.answer(f"You do not have enough funds your balance is {response.decode().strip()[1:-1]} TON")
        else:
            await message.answer("Wrong amount value")

    else:
        if len(message.text.split(".")[0]) > 1:
            await message.answer("Wrong amount value")
        else:
            async with aiohttp.ClientSession() as session:
                async with session.get(f'http://127.0.0.1:8000/api/v1/getbalance/{message.chat.id}') as resp:
                    if resp.status == 200:
                        response = await resp.read()
                        if float(response.decode().strip()[1:-1]) >= float(message.text):
                            await state.set_state(WithdrawStates.wallet_input)
                            await state.update_data(amount=message.text)
                            await message.answer("Enter wallet address:", reply_markup=cancel_keyboard())
                        else:
                            await message.answer(f"You do not have enough funds your balance is {response.decode().strip()[1:-1]} TON")


async def wallet_input(message: types.Message, state: FSMContext):
    try:
        prepare_address(message.text.strip())
    except Exception:
        await message.answer("Incorrect wallet address")
    else:
        await state.update_data(to_address=message.text)
        data = await state.get_data()
        await state.set_state(WithdrawStates.submit)
        await message.answer(f"Address: {data['to_address']}\nAmount: {data['amount']}", reply_markup=InlineKeyboardMarkup().add(InlineKeyboardButton("Submit", callback_data=cb_common_btn.new(do="submit"))))



async def submit(call: types.CallbackQuery, state: FSMContext):
    key = os.getenv("AESKEY").encode()
    data = await state.get_data()
    async with aiohttp.ClientSession() as session:
        async with session.post(f'http://127.0.0.1:8000/api/v1/transfer', json={"from": encryptAES(key, call.message.chat.id.encode()), "to": data["to_address"], "amount": data["amount"]}) as resp:
            if resp.status == 200:
                await call.message.answer("Funds will be credited within 2 minutes")
    await state.set_state(WalletStates.waiting_click_btn)
    await call.message.answer("Wallet", reply_markup=wallet_keyboard())


async def cancel():
    await cmd_wallet()


def register_wallet(dp: Dispatcher):
    dp.register_callback_query_handler(deposit, cb_wallet.filter(btn="deposit"), state=WalletStates.waiting_click_btn)
    dp.register_callback_query_handler(withdraw, cb_wallet.filter(btn="withdraw"), state=WalletStates.waiting_click_btn)
    dp.register_message_handler(amount_input, commands=None, content_types=types.ContentTypes.TEXT, state=WithdrawStates.amount_input)
    dp.register_message_handler(wallet_input, commands=None, content_types=types.ContentTypes.TEXT, state=WithdrawStates.wallet_input)
    dp.register_callback_query_handler(submit, cb_common_btn.filter(do="submit"), state=WithdrawStates.submit)
    dp.register_callback_query_handler(cancel, cb_common_btn.filter(do="cancel"), state=[WithdrawStates.amount_input,WithdrawStates.wallet_input])