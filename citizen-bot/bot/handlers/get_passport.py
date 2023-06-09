import os
from aiogram import types, Dispatcher
import aiohttp
from bot.db.models import get_user
from bot.keyboards import form_keyboard, cancel_keyboard, _get_datepicker_settings, gender_keyboard
from bot.states import FormStates, WelcomeStates
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters import Text
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton, ReplyKeyboardRemove
from bot.db.models import User
from bot.common import form_text, cb_form, cb_gender, metadata, cb_common_btn
from aiogram_datepicker import Datepicker
from datetime import datetime
from tonsdk.contract.wallet import WalletVersionEnum, Wallets
import aiohttp
import base64
import json

async def get_passport(message: types.Message, state: FSMContext):
    await state.set_state(FormStates.waiting_click_form)
    data = await state.get_data()
    await message.answer(text="Fill data",reply_markup=ReplyKeyboardRemove())
    await message.answer(form_text.format(data["first_name"] if "first_name" in data else "🚫", data["last_name"] if "last_name" in data else "🚫", data["gender"] if "gender" in data else "🚫", data["date_of_birth"] if "date_of_birth" in data else "🚫", "🖼" if "photo" in data else "🚫"), reply_markup=form_keyboard(), parse_mode="Markdown")
    
async def first_name_form(call: types.CallbackQuery, state: FSMContext):
    await state.set_state(FormStates.first_name_input)
    await call.message.answer("*First name:*", reply_markup=cancel_keyboard(), parse_mode="Markdown")


async def last_name_form(call: types.CallbackQuery, state: FSMContext):
    await state.set_state(FormStates.last_name_input)
    await call.message.answer("*Last name:*", reply_markup=cancel_keyboard(), parse_mode="Markdown")


async def gender_form(call: types.CallbackQuery, state: FSMContext):
    await state.set_state(FormStates.gender_input)
    await call.message.answer("*Gender select:*", reply_markup=gender_keyboard(), parse_mode="Markdown")


async def date_of_birth_form(call: types.CallbackQuery, state: FSMContext):
    await state.set_state(FormStates.date_of_birth_input)
    datepicker = Datepicker(_get_datepicker_settings())
    markup = datepicker.start_calendar()
    await call.message.answer("*Select a date:*", reply_markup=markup, parse_mode="Markdown")


async def upload_photo_form(call: types.CallbackQuery, state: FSMContext):
    await state.set_state(FormStates.photo_upload)
    await call.message.answer("*Send a photo:*", reply_markup=cancel_keyboard(), parse_mode="Markdown")


async def cancel(call: types.CallbackQuery, state: FSMContext):
    if await state.get_state() == FormStates.first_name_input.state or await state.get_state() == FormStates.last_name_input.state or await state.get_state() == FormStates.gender_input.state or await state.get_state() == FormStates.date_of_birth_input.state or await state.get_state() == FormStates.photo_upload.state:
        await state.set_state(FormStates.waiting_click_form)
        data = await state.get_data()
        await call.message.answer(form_text.format(data["first_name"] if "first_name" in data else "🚫", data["last_name"] if "last_name" in data else "🚫", data["gender"] if "gender" in data else "🚫", data["date_of_birth"] if "date_of_birth" in data else "🚫", "🖼" if "photo" in data else "🚫"), reply_markup=form_keyboard(), parse_mode="Markdown")


async def submit(call: types.CallbackQuery, state: FSMContext):
    data = await state.get_data()

    if "first_name" in data and "last_name" in data and "gender" in data and "date_of_birth" in data and "photo" in data:
        os.system("rm -rf photos")

        await data["photo"][-1].download()
        if "first_name" not in data or "last_name" not in data or "gender" not in data or "photo" not in data or "date_of_birth" not in data:
            await call.answer("Fill in all the data")
            await call.message.answer(form_text.format(data["first_name"] if "first_name" in data else "🚫", data["last_name"] if "last_name" in data else "🚫", data["gender"] if "gender" in data else "🚫", data["date_of_birth"] if "date_of_birth" in data else "🚫", "🖼" if "photo" in data else "🚫"), reply_markup=form_keyboard(), parse_mode="Markdown")
        else:
            db_session = call.message.bot.get("db")

            await state.set_state(WelcomeStates.waiting_click_btn)

            user = await get_user(call.message.chat.id, db_session)

            with open(f'photos/{os.listdir("photos")[-1]}', 'rb') as f:
                photo_bytes = f.read()
                base64_encoded = "data:image/jpg;base64," + \
                    base64.b64encode(photo_bytes).decode('utf-8')

            os.system("rm -rf photos")

            seed = user.seed.split(" ")
            wallet = Wallets.from_mnemonics(seed, WalletVersionEnum.v3r2, 0)

            metadata["attributes"][0]["value"] = data["first_name"]
            metadata["attributes"][1]["value"] = data["last_name"]
            metadata["attributes"][2]["value"] = data["gender"]
            metadata["attributes"][3]["value"] = data["date_of_birth"]
            metadata["attributes"][5]["value"] = datetime.now(
            ).date().strftime('%d.%m.%Y')
            metadata["attributes"][6]["value"] = "Citizen"
            key = os.getenv("KEY")

            await call.message.answer("wait for your passport to be minted")
            async with aiohttp.ClientSession() as session:
                async with session.post(f'{os.getenv("api_url")}/api/v1/deployNFT', json={"photo": base64_encoded, "id": call.message.chat.id, "address": wallet[3].address.to_string(True, True, True), "content": metadata, "key": key}) as resp:
                    response = await resp.read()

                if resp.status == 200:
                    data = json.loads(response.decode())
                    metadata["attributes"][4]["value"] = data["img"]
                    async with db_session() as session:
                        user: User = await session.get(User, call.message.chat.id)
                        user.content = json.dumps(metadata)
                        user.ispassport = True
                        await session.commit()
                    await call.message.answer("We passport", reply_markup=InlineKeyboardMarkup().add(InlineKeyboardButton("GO", web_app=WebAppInfo(url=f'{os.getenv("api_url")}?id={call.message.chat.id}&username={call.message.chat.username}'))))
                else:
                    await state.set_state(FormStates.waiting_click_form)
                    await call.message.answer("Failed to mint passport try again")
                    await call.message.answer(form_text.format(data["first_name"] if "first_name" in data else "🚫", data["last_name"] if "last_name" in data else "🚫", data["gender"] if "gender" in data else "🚫", data["date_of_birth"] if "date_of_birth" in data else "🚫", "🖼" if "photo" in data else "🚫"), reply_markup=form_keyboard(), parse_mode="Markdown")
    else:
        await call.message.answer("*Enter all data:*", parse_mode="Markdown")
        await call.message.answer(form_text.format(data["first_name"] if "first_name" in data else "🚫", data["last_name"] if "last_name" in data else "🚫", data["gender"] if "gender" in data else "🚫", data["date_of_birth"] if "date_of_birth" in data else "🚫", "🖼" if "photo" in data else "🚫"), reply_markup=form_keyboard(), parse_mode="Markdown")



async def man_select(call: types.CallbackQuery, state: FSMContext):
    await state.update_data(gender="man")
    data = await state.get_data()
    await state.set_state(FormStates.waiting_click_form)
    await call.message.answer(form_text.format(data["first_name"] if "first_name" in data else "🚫", data["last_name"] if "last_name" in data else "🚫", data["gender"] if "gender" in data else "🚫", data["date_of_birth"] if "date_of_birth" in data else "🚫", "🖼" if "photo" in data else "🚫"), reply_markup=form_keyboard(), parse_mode="Markdown")


async def woman_select(call: types.CallbackQuery, state: FSMContext):
    await state.update_data(gender="woman")
    data = await state.get_data()
    await state.set_state(FormStates.waiting_click_form)
    await call.message.answer(form_text.format(data["first_name"] if "first_name" in data else "🚫", data["last_name"] if "last_name" in data else "🚫", data["gender"] if "gender" in data else "🚫", data["date_of_birth"] if "date_of_birth" in data else "🚫", "🖼" if "photo" in data else "🚫"), reply_markup=form_keyboard(), parse_mode="Markdown")



async def _process_datepicker(call: types.CallbackQuery, callback_data: dict, state: FSMContext):
    datepicker = Datepicker(_get_datepicker_settings())
    _date = await datepicker.process(call, callback_data)
    if _date:
        await state.update_data(date_of_birth=_date.strftime('%d.%m.%Y'))
        await state.set_state(FormStates.waiting_click_form)
        data = await state.get_data()
        await call.message.answer(form_text.format(data["first_name"] if "first_name" in data else "🚫", data["last_name"] if "last_name" in data else "🚫", data["gender"] if "gender" in data else "🚫", data["date_of_birth"] if "date_of_birth" in data else "🚫", "🖼" if "photo" in data else "🚫"), reply_markup=form_keyboard(), parse_mode="Markdown")


async def first_name_input(message: types.Message, state: FSMContext):
    await state.update_data(first_name=message.text)
    data = await state.get_data()
    await state.set_state(FormStates.waiting_click_form)
    await message.answer(form_text.format(data["first_name"] if "first_name" in data else "🚫", data["last_name"] if "last_name" in data else "🚫", data["gender"] if "gender" in data else "🚫", data["date_of_birth"] if "date_of_birth" in data else "🚫", "🖼" if "photo" in data else "🚫"), reply_markup=form_keyboard(), parse_mode="Markdown")


async def last_name_input(message: types.Message, state: FSMContext):
    await state.update_data(last_name=message.text)
    data = await state.get_data()
    await state.set_state(FormStates.waiting_click_form)
    await message.answer(form_text.format(data["first_name"] if "first_name" in data else "🚫", data["last_name"] if "last_name" in data else "🚫", data["gender"] if "gender" in data else "🚫", data["date_of_birth"] if "date_of_birth" in data else "🚫", "🖼" if "photo" in data else "🚫"), reply_markup=form_keyboard(), parse_mode="Markdown")

async def upload_photo(message: types.Message, state: FSMContext):
    await state.update_data(photo=message.photo)
    data = await state.get_data()
    await state.set_state(FormStates.waiting_click_form)
    await message.answer(form_text.format(data["first_name"] if "first_name" in data else "🚫", data["last_name"] if "last_name" in data else "🚫", data["gender"] if "gender" in data else "🚫", data["date_of_birth"] if "date_of_birth" in data else "🚫", "🖼" if "photo" in data else "🚫"), reply_markup=form_keyboard(), parse_mode="Markdown")



def register_get_passport(dp: Dispatcher):
    dp.register_message_handler(get_passport, (Text(equals="Get passport 🪪")), state="*")

    dp.register_callback_query_handler(first_name_form, cb_form.filter(data="first name"), state=FormStates.waiting_click_form)
    dp.register_callback_query_handler(last_name_form, cb_form.filter(data="last name"), state=FormStates.waiting_click_form)
    dp.register_callback_query_handler(gender_form, cb_form.filter(data="gender"), state=FormStates.waiting_click_form)
    dp.register_callback_query_handler(date_of_birth_form, cb_form.filter(data="date of birth"), state=FormStates.waiting_click_form)
    dp.register_callback_query_handler(upload_photo_form, cb_form.filter(data="upload photo"), state=FormStates.waiting_click_form)

    dp.register_message_handler(first_name_input, commands=None, content_types=types.ContentTypes.TEXT, state=FormStates.first_name_input)
    dp.register_message_handler(last_name_input, commands=None, content_types=types.ContentTypes.TEXT, state=FormStates.last_name_input)
    dp.register_message_handler(upload_photo, commands=None, content_types=types.ContentTypes.PHOTO, state=FormStates.photo_upload)

    dp.register_callback_query_handler(man_select, cb_gender.filter(btn="man"), state=FormStates.gender_input)
    dp.register_callback_query_handler(woman_select, cb_gender.filter(btn="woman"), state=FormStates.gender_input)

    dp.register_callback_query_handler(_process_datepicker, Datepicker.datepicker_callback.filter(), state=FormStates.date_of_birth_input)

    dp.register_callback_query_handler(cancel, cb_common_btn.filter(do="cancel"), state="*")
    dp.register_callback_query_handler(submit, cb_form.filter(data="submit"), state=FormStates.waiting_click_form)
    