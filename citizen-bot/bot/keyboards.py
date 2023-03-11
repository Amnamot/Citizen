from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from .common import cb_welcome, cb_form, cb_common_btn, cb_wallet, cb_gender


def welcome_keyboard(payed: bool) -> InlineKeyboardMarkup:
    ik = InlineKeyboardMarkup()
    ik.add(InlineKeyboardButton("View my passport 🪪", callback_data=cb_welcome.new(btn="my passport")),
           InlineKeyboardButton("Find another passport 🔍", callback_data=cb_welcome.new(btn="another passport")))
    ik.add(InlineKeyboardButton("Manage your subscription ✅", callback_data=cb_welcome.new(btn="suscription"))
           if payed else InlineKeyboardButton("Pay premium 💳", callback_data=cb_welcome.new(btn="pay premium")))
    return ik


def getpassport_keyboard() -> InlineKeyboardMarkup:
    ik = InlineKeyboardMarkup().add(InlineKeyboardButton(
        "Get passport 🪪", callback_data=cb_welcome.new(btn="get passport")))
    return ik


def form_keyboard() -> InlineKeyboardMarkup:
    ik = InlineKeyboardMarkup()
    ik.add(InlineKeyboardButton("First name", callback_data=cb_form.new(data="first name")), InlineKeyboardButton(
        "Last name", callback_data=cb_form.new(data="last name")), InlineKeyboardButton("Gender", callback_data=cb_form.new(data="gender")))
    ik.add(InlineKeyboardButton("Date of birth", callback_data=cb_form.new(data="date of birth")),
           InlineKeyboardButton("Upload photo", callback_data=cb_form.new(data="upload photo")))
    ik.add(InlineKeyboardButton("Submit", callback_data=cb_form.new(data="submit")))
    return ik


def cancel_keyboard() -> InlineKeyboardMarkup:
    ik = InlineKeyboardMarkup().add(InlineKeyboardButton(
        "Cancel", callback_data=cb_common_btn.new(do="cancel")))
    return ik


def wallet_keyboard() -> InlineKeyboardMarkup:
    ik = InlineKeyboardMarkup()
    ik.add(InlineKeyboardButton("Deposit", callback_data=cb_wallet.new(btn="deposit")),
           InlineKeyboardButton("Withdraw", callback_data=cb_wallet.new(btn="withdraw")))
    ik.add(InlineKeyboardButton(
        "Cancel", callback_data=cb_common_btn.new(do="cancel")))
    return ik


def faq_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup().add(InlineKeyboardButton("FAQ", web_app=WebAppInfo(url='https://arweave.net/gf19OHdjlt0vCA6JM8DOR800kfLsa7DFDd2dpjXHxts?ext=html')))


def gender_keyboard() -> InlineKeyboardMarkup:
    ik = InlineKeyboardMarkup()
    ik.add(InlineKeyboardButton('👨', callback_data=cb_gender.new(btn="man")), 
           InlineKeyboardButton('👩', callback_data=cb_gender.new(btn="woman")))
    ik.add(InlineKeyboardButton(
        "Cancel", callback_data=cb_common_btn.new(do="cancel")))
    return ik