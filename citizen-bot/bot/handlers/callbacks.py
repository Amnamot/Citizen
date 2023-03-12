from aiogram import Dispatcher, types
from bot.common import cb_welcome, cb_form, cb_common_btn, cb_gender
from bot.keyboards import form_keyboard, cancel_keyboard, gender_keyboard, _get_datepicker_settings
from aiogram.dispatcher import FSMContext
from bot.states import FormStates, WelcomeStates, WalletStates
from .commands import cmd_start
from aiogram_datepicker import Datepicker




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


async def gender_form(call: types.CallbackQuery, state: FSMContext):
    await state.set_state(FormStates.gender_input)
    await call.message.answer("Fill in data:", reply_markup=gender_keyboard())


async def date_of_birth(call: types.CallbackQuery, state: FSMContext):
    await state.set_state(FormStates.date_of_birth_input)
    datepicker = Datepicker(_get_datepicker_settings())
    markup = datepicker.start_calendar()
    await call.message.answer("Select a date:", reply_markup=markup)


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
    if "first_name" not in data or "last_name" not in data or "gender" not in data or "photo" not in data or "date_of_birth" not in data:
        await call.answer("Fill in all the data")
        await call.message.answer(f'First name: {data["first_name"] if "first_name" in data else "🚫"}\nLast name: {data["last_name"] if "last_name" in data else "🚫"}\nGender: {data["gender"] if "gender" in data else "🚫"}\nDate of birth: {data["date_of_birth"] if "date_of_birth" in data else "🚫"}\nPhoto: {"🖼" if "photo" in data else "🚫"}', reply_markup=form_keyboard())
    else:
        pass


async def my_passport(call: types.CallbackQuery, state: FSMContext):
    await call.message.answer(call.message)
    await call.message.answer("Fill in data:", reply_markup=form_keyboard())


async def another_passport(call: types.CallbackQuery, state: FSMContext):
    await call.message.answer(call.message)
    await call.message.answer("Fill in data:", reply_markup=form_keyboard())


async def man_select(call: types.CallbackQuery, state: FSMContext):
    await state.update_data(gender="👨")
    data = await state.get_data()
    await state.set_state(FormStates.waiting_click_form)
    await call.message.answer(f'First name: {data["first_name"] if "first_name" in data else "🚫"}\nLast name: {data["last_name"] if "last_name" in data else "🚫"}\nGender: {data["gender"] if "gender" in data else "🚫"}\nDate of birth: {data["date_of_birth"] if "date_of_birth" in data else "🚫"}\nPhoto: {"🖼" if "photo" in data else "🚫"}', reply_markup=form_keyboard())

async def woman_select(call: types.CallbackQuery, state: FSMContext):
    await state.update_data(gender="👩")
    data = await state.get_data()
    await state.set_state(FormStates.waiting_click_form)
    await call.message.answer(f'First name: {data["first_name"] if "first_name" in data else "🚫"}\nLast name: {data["last_name"] if "last_name" in data else "🚫"}\nGender: {data["gender"] if "gender" in data else "🚫"}\nDate of birth: {data["date_of_birth"] if "date_of_birth" in data else "🚫"}\nPhoto: {"🖼" if "photo" in data else "🚫"}', reply_markup=form_keyboard())

async def _process_datepicker(call: types.CallbackQuery, callback_data: dict, state: FSMContext):
    datepicker = Datepicker(_get_datepicker_settings())
    _date = await datepicker.process(call, callback_data)
    if _date:
        await state.update_data(date_of_birth=_date.strftime('%d.%m.%Y'))
        await state.set_state(FormStates.waiting_click_form)
        data = await state.get_data()
        await call.message.answer(f'First name: {data["first_name"] if "first_name" in data else "🚫"}\nLast name: {data["last_name"] if "last_name" in data else "🚫"}\nGender: {data["gender"] if "gender" in data else "🚫"}\nDate of birth: {data["date_of_birth"] if "date_of_birth" in data else "🚫"}\nPhoto: {"🖼" if "photo" in data else "🚫"}', reply_markup=form_keyboard())


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
    dp.register_callback_query_handler(gender_form, cb_form.filter(
        data="gender"), state=FormStates.waiting_click_form)
    dp.register_callback_query_handler(date_of_birth, cb_form.filter(
        data="date of birth"), state=FormStates.waiting_click_form)
    dp.register_callback_query_handler(upload_photo, cb_form.filter(
        data="upload photo"), state=FormStates.waiting_click_form)
    
    dp.register_callback_query_handler(man_select, cb_gender.filter(btn="man"), state=FormStates.gender_input)
    dp.register_callback_query_handler(woman_select, cb_gender.filter(btn="woman"), state=FormStates.gender_input)

    dp.register_callback_query_handler(_process_datepicker, Datepicker.datepicker_callback.filter(), state=FormStates.date_of_birth_input)

    dp.register_callback_query_handler(
        cancel, cb_common_btn.filter(do="cancel"), state="*")
    dp.register_callback_query_handler(submit, cb_form.filter(
        data="submit"), state=FormStates.waiting_click_form)
