import os
import asyncio
import logging
from aiogram import Bot, Dispatcher
from aiogram.types import BotCommand
from aiogram.types.bot_command_scope import BotCommandScopeDefault
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from bot.handlers.commands import register_commands
from bot.handlers.forms import register_forms
from bot.handlers.search import register_search
from bot.handlers.wallet import register_wallet
from bot.handlers.welcome import register_welcome
from dotenv import load_dotenv

load_dotenv()

async def set_bot_commands(bot: Bot):

    commands = [
        BotCommand(command="my", description="My pasport"),
        BotCommand(command="requests", description="Verification requests"),
        BotCommand(command="search", description="Find a pasport"),
        BotCommand(command="premium", description="Premium"),
        BotCommand(command="faq", description="FAQ"),
        BotCommand(command="donate", description="Donate"),
        BotCommand(command="edit", description="Edit data"),
        BotCommand(command="wallet", description="Wallet"),
    ]

    await bot.set_my_commands(commands, scope=BotCommandScopeDefault())


async def main():

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
    )

    engine = create_async_engine(
        f"postgresql+asyncpg://{os.getenv('USER')}:{os.getenv('PASSWORD')}@{os.getenv('HOST')}/{os.getenv('DBNAME')}",
        future=True
    )

    async_sessionmaker = sessionmaker(
        engine, expire_on_commit=False, class_=AsyncSession
    )

    bot = Bot(os.getenv('BOT'), parse_mode="HTML")
    bot["db"] = async_sessionmaker
    dp = Dispatcher(bot, storage=MemoryStorage())

    register_commands(dp)
    register_forms(dp)
    register_search(dp)
    register_wallet(dp)
    register_welcome(dp)

    await set_bot_commands(bot)

    await dp.start_polling()

try:
    asyncio.run(main())
except (KeyboardInterrupt, SystemExit):
    logging.error("Bot stopped!")
