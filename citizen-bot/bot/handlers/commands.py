from aiogram import types, Dispatcher
from bot.db.models import get_user, create_user
from bot.keyboards import welcome_keyboard, getpassport_keyboard, form_keyboard, wallet_keyboard, faq_keyboard
from bot.states import WelcomeStates
from aiogram.dispatcher import FSMContext
from bot.states import FormStates, WalletStates


async def cmd_start(message: types.Message, state: FSMContext):
    db_session = message.bot.get("db")
    key = message.bot.get("key")
    
    await state.set_state(WelcomeStates.waiting_click_btn)

    user = await get_user(message.chat.id, db_session)

    if user:
        if user.token_url:
            await message.answer("We are pleased to welcome you!\nYou can now do the following:", reply_markup=welcome_keyboard(user.payed))
        else:
            await message.answer("We are pleased to welcome you!\nYou do not have a passport yet.\nIn the web 3.0 world you will definitely need one.", reply_markup=getpassport_keyboard())
    else:
        await create_user(message.chat.id, db_session, key)
        await message.answer("We are pleased to welcome you!\nYou do not have a passport yet.\nIn the web 3.0 world you will definitely need one.", reply_markup=getpassport_keyboard())


async def cmd_wallet(message: types.Message, state: FSMContext):
    # db_session = message.bot.get("db")
    # key = message.bot.get("key")
    
    await state.set_state(WalletStates.waiting_click_btn)

    await message.answer("Wallet", reply_markup=wallet_keyboard())


async def cmd_faq(message: types.Message):
    
    await message.answer("FAQ", reply_markup=faq_keyboard())

        

async def default(message: types.Message, state: FSMContext):
    if await state.get_state() == FormStates.first_name_input.state:
        await state.update_data(first_name=message.text)
        data = await state.get_data()
        await message.answer(f'First name: {data["first_name"] if "first_name" in data else "🚫"}\nLast name: {data["last_name"] if "last_name" in data else "🚫"}\nGender: {data["gender"] if "gender" in data else "🚫"}\nDate of birth: {data["date_of_birth"] if "date_of_birth" in data else "🚫"}\nPhoto: {"🖼" if "photo" in data else "🚫"}', reply_markup=form_keyboard())
    elif await state.get_state() == FormStates.last_name_input.state:
        await state.update_data(last_name=message.text)
        data = await state.get_data()
        await message.answer(f'First name: {data["first_name"] if "first_name" in data else "🚫"}\nLast name: {data["last_name"] if "last_name" in data else "🚫"}\nGender: {data["gender"] if "gender" in data else "🚫"}\nDate of birth: {data["date_of_birth"] if "date_of_birth" in data else "🚫"}\nPhoto: {"🖼" if "photo" in data else "🚫"}', reply_markup=form_keyboard())
    elif await state.get_state() == FormStates.photo_upload.state:
        await state.update_data(photo=message.photo)
        data = await state.get_data()
        await message.answer(f'First name: {data["first_name"] if "first_name" in data else "🚫"}\nLast name: {data["last_name"] if "last_name" in data else "🚫"}\nGender: {data["gender"] if "gender" in data else "🚫"}\nDate of birth: {data["date_of_birth"] if "date_of_birth" in data else "🚫"}\nPhoto: {"🖼" if "photo" in data else "🚫"}', reply_markup=form_keyboard())


    await state.set_state(FormStates.waiting_click_form)


def register_commands(dp: Dispatcher):
    dp.register_message_handler(cmd_start, commands="start")
    dp.register_message_handler(cmd_wallet, commands="wallet", state="*")
    dp.register_message_handler(cmd_faq, commands="faq", state="*")
    dp.register_message_handler(default, commands=None, content_types=types.ContentTypes.ANY, state="*")