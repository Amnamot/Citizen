from aiogram.dispatcher.filters.state import State, StatesGroup

class FormStates(StatesGroup):
    waiting_click_form = State()
    first_name_input = State()
    last_name_input = State()
    gender_input = State()
    date_of_birth_input = State()
    photo_upload = State()
    submit_form = State()
    typing = State()


class WelcomeStates(StatesGroup):
    waiting_click_btn = State()
    get_passport = State()
    my_passport = State()
    another_passport = State()
    pay_premium = State()
    subscription = State()


class WalletStates(StatesGroup):
    waiting_click_btn = State()
    withdraw = State()


class WithdrawStates(StatesGroup):
    amount_input = State()
    wallet_input = State()
    submit = State()


class SearchStates(StatesGroup):
    input_username = State()