from .base import BaseModel
from sqlalchemy import Column, Integer, VARCHAR, Boolean
from sqlalchemy.orm import sessionmaker
from tonsdk.crypto import mnemonic_new
from bot.utils.aes import encrypt_aes


class User(BaseModel):
    __tablename__ = "users"

    telegram_id = Column(Integer, unique=True,
                         nullable=False, primary_key=True)
    seed = Column(VARCHAR(320), unique=True, nullable=False)
    token_url = Column(VARCHAR(80), unique=True)
    payed = Column(Boolean, default=False)


async def get_user(telegram_id: int, session_maker: sessionmaker) -> User:
    async with session_maker() as session:
        return await session.get(User, telegram_id)


async def create_user(telegram_id: int, session_maker: sessionmaker, key: str):
    seed = ' '.join(mnemonic_new())

    async with session_maker() as session:
        await session.merge(User(telegram_id=telegram_id, seed=encrypt_aes(key, seed)))
        await session.commit()
