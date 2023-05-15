from aiogram.utils.callback_data import CallbackData

cb_form = CallbackData("form", "data")

cb_common_btn = CallbackData("btn", "do")

cb_wallet = CallbackData("do", "btn")

cb_gender = CallbackData("gender", "btn")


form_text = '*First name:* {}\n*Last name:* {}\n*Gender:* {}\n*Date of birth:* {}\n*Photo:* {}'

metadata = {"name":"Citizen","description":"Citizen passport web 3.0","image":"https://arweave.net/rHbjyHd_mr_BiXwhpoODJgVMtVn4_-OS65ZSeHsh3QU?ext=png","content_url":"https://citizen.io","attributes":[{"trait_type":"First name","value":""},{"trait_type":"Last name","value":""},{"trait_type":"Gender","value":""},{"trait_type":"Date of birth","value":""},{"trait_type":"Photo","value":""},{"trait_type":"Date of issue","value":""},{"trait_type":"Rate","value":""}],"vices":{},"characters":{},"moralities":{},"skills":{},"emotions":{},"attitudes":{},"ties":{}}