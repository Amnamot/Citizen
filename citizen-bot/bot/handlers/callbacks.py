from aiogram import Dispatcher, types
from bot.common import cb_welcome, cb_form, cb_common_btn
from bot.keyboards import form_keyboard, cancel_keyboard, gender_keyboard
from aiogram.dispatcher import FSMContext
from bot.states import FormStates, WelcomeStates, WalletStates
from .commands import cmd_start


async def get_passport(call: types.CallbackQuery, state: FSMContext):
    await state.set_state(FormStates.waiting_click_form)
    data = await state.get_data()
    await call.message.answer(f'First name: {data["first_name"] if "first_name" in data else "🚫"}\nLast name: {data["last_name"] if "last_name" in data else "🚫"}\nGender: {data["gender"] if "gender" in data else "🚫"}\nDate of birth: {data["date_of_birth"] if "date_of_birth" in data else "🚫"}\nPhoto: {"🖼" if "photo" in data else "🚫"}', reply_markup=form_keyboard())


async def first_name_input(call: types.CallbackQuery, state: FSMContext):
    await state.set_state(FormStates.first_name_input)
    await call.message.answer("Fill in data:", reply_markup=cancel_keyboard())


async def last_name_input(call: types.CallbackQuery, state: FSMContext):
    await state.set_state(FormStates.last_name_input)
    await call.message.answer("Fill in data:", reply_markup=cancel_keyboard())


async def gender_select(call: types.CallbackQuery, state: FSMContext):
    await state.set_state(FormStates.gender_input)
    await call.message.answer("Fill in data:", reply_markup=gender_keyboard())


async def date_of_birth(call: types.CallbackQuery, state: FSMContext):
    await state.set_state(FormStates.date_of_birth_input)
    await call.message.answer("Fill in data:", reply_markup=cancel_keyboard())


async def upload_photo(call: types.CallbackQuery, state: FSMContext):
    await state.set_state(FormStates.photo_upload)
    await call.message.answer("Fill in data:", reply_markup=cancel_keyboard())


async def cancel(call: types.CallbackQuery, state: FSMContext):
    if await state.get_state() == FormStates.first_name_input.state or await state.get_state() == FormStates.last_name_input.state or await state.get_state() == FormStates.gender_input.state or await state.get_state() == FormStates.date_of_birth_input.state or await state.get_state() == FormStates.photo_upload.state:
        await state.set_state(FormStates.waiting_click_form)
        data = await state.get_data()
        await call.message.answer(f'First name: {data["first_name"] if "first_name" in data else "🚫"}\nLast name: {data["last_name"] if "last_name" in data else "🚫"}\nGender: {data["gender"] if "gender" in data else "🚫"}\nDate of birth: {data["date_of_birth"] if "date_of_birth" in data else "🚫"}\nPhoto: {"🖼" if "photo" in data else "🚫"}', reply_markup=form_keyboard())

    if await state.get_state() == WalletStates.waiting_click_btn.state:
        await cmd_start(call.message, state)


async def submit(call: types.CallbackQuery, state: FSMContext):
    data = await state.get_data()
    await call.message.answer(data)


async def my_passport(call: types.CallbackQuery, state: FSMContext):
    await call.message.answer(call.message)
    await call.message.answer("Fill in data:", reply_markup=form_keyboard())


async def another_passport(call: types.CallbackQuery, state: FSMContext):
    await call.message.answer(call.message)
    await call.message.answer("Fill in data:", reply_markup=form_keyboard())


def register_callbacks(dp: Dispatcher):
    dp.register_callback_query_handler(get_passport, cb_welcome.filter(
        btn="get passport"), state=WelcomeStates.waiting_click_btn)
    dp.register_callback_query_handler(my_passport, cb_welcome.filter(
        btn="my passport"), state=WelcomeStates.waiting_click_btn)
    dp.register_callback_query_handler(another_passport, cb_welcome.filter(
        btn="another passport"), state=WelcomeStates.waiting_click_btn)

    dp.register_callback_query_handler(first_name_input, cb_form.filter(
        data="first name"), state=FormStates.waiting_click_form)
    dp.register_callback_query_handler(last_name_input, cb_form.filter(
        data="last name"), state=FormStates.waiting_click_form)
    dp.register_callback_query_handler(gender_select, cb_form.filter(
        data="gender"), state=FormStates.waiting_click_form)
    dp.register_callback_query_handler(date_of_birth, cb_form.filter(
        data="date of birth"), state=FormStates.waiting_click_form)
    dp.register_callback_query_handler(upload_photo, cb_form.filter(
        data="upload photo"), state=FormStates.waiting_click_form)

    dp.register_callback_query_handler(
        cancel, cb_common_btn.filter(do="cancel"), state="*")
    dp.register_callback_query_handler(submit, cb_form.filter(
        data="submit"), state=FormStates.waiting_click_form)
