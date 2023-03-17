from aiogram.utils.callback_data import CallbackData

cb_welcome = CallbackData("welcome", "btn")

cb_form = CallbackData("form", "data")

cb_common_btn = CallbackData("btn", "do")

cb_wallet = CallbackData("do", "btn")

cb_gender = CallbackData("gender", "btn")


form_text = '*First name:* {}\n*Last name:* {}\n*Gender:* {}\n*Date of birth:* {}\n*Photo:* {}'

metadata = {
    "name": "Citizen",
    "description": "Citizen passport web 3.0",
    "image": "https://arweave.net/rHbjyHd_mr_BiXwhpoODJgVMtVn4_-OS65ZSeHsh3QU?ext=png",
    "content_url": "https://tonbyte.com/gateway/CD6222006BCDE74BAF4AFE6597C479B3614AD084193943B43D56ECDD82CA1EBC/index.html",
    "attributes": [
        {
            "trait_type": "First name",
            "value": ""
        },
        {
            "trait_type": "Last name",
            "value": ""
        },
        {
            "trait_type": "Gender",
            "value": ""
        },
        {
            "trait_type": "Date of birth",
            "value": ""
        },
        {
            "trait_type": "Photo",
            "value": ""
        },
        {
            "trait_type": "Telegram username",
            "value": ""
        },
        {
            "trait_type": "Telegram ID",
            "value": 0
        },
        {
            "trait_type": "Date of issue",
            "value": ""
        },
        {
            "trait_type": "Rate",
            "value": ""
        },
        {
            "trait_type": "Action Points",
            "value": [0,0]
        },
        {
            "trait_type": "Vices",
            "value": []
        },
        {
            "trait_type": "Characters",
            "value": []
        },
        {
            "trait_type": "Emotions",
            "value": []
        },
        {
            "trait_type": "Moralities",
            "value": []
        },
        {
            "trait_type": "Attitudes",
            "value": []
        },
        {
            "trait_type": "Skills",
            "value": []
        },
        {
            "trait_type": "Social ties",
            "value": []
        }
    ]
}