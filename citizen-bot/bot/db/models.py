from .base import BaseModel
from sqlalchemy import Column, Integer, VARCHAR, Boolean
from sqlalchemy.orm import sessionmaker
from tonsdk.crypto import mnemonic_new


class User(BaseModel):
    __tablename__ = "users"

    telegram_id = Column(Integer, unique=True,
                         nullable=False, primary_key=True)
    username = Column(VARCHAR(20), unique=True, nullable=False)
    seed = Column(VARCHAR(320), unique=True, nullable=False)
    ispassport = Column(Boolean, default=False)
    payed = Column(Boolean, default=False)


async def get_user(telegram_id: int, session_maker: sessionmaker) -> User:
    async with session_maker() as session:
        return await session.get(User, telegram_id)


async def create_user(telegram_id: int, username: str, session_maker: sessionmaker):
    seed = ' '.join(mnemonic_new())
    async with session_maker() as session:
        await session.merge(User(telegram_id=telegram_id,
                                 username=username, seed=seed))
        await session.commit()

