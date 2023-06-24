from .base import BaseModel
from sqlalchemy import Column, Integer, VARCHAR, Boolean, Text, ForeignKey
from sqlalchemy.orm import sessionmaker, relationship
from tonsdk.crypto import mnemonic_new
from tonsdk.contract.wallet import WalletVersionEnum, Wallets

class User(BaseModel):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(VARCHAR(50), unique=True, nullable=False)
    seed = Column(VARCHAR(320), unique=True, nullable=False)
    address = Column(VARCHAR(320), unique=True, nullable=False)
    ispassport = Column(Boolean, default=False)
    action_points = Column(Integer, default=0)
    payed = Column(Boolean, default=False)
    isedit = Column(Boolean, default=False)
    content = Column(Text, nullable=True)

    vices = relationship("Vice")
    skills = relationship("Skill")
    moralities = relationship("Morality")
    attitudes = relationship("Attitude")
    emotions = relationship("Emotion")
    characters = relationship("Character")

class Vice(BaseModel):
    __tablename__ = 'vices'
    id = Column(Integer, primary_key=True)
    name = Column(VARCHAR(100), nullable=False, unique=True)
    yes = Column(Integer, nullable=False, default=0)
    no = Column(Integer, nullable=False, default=0)
    ignore = Column(Integer, nullable=False, default=0)
    user_id = Column(Integer, ForeignKey('users.id'))

class Morality(BaseModel):
    __tablename__ = 'moralities'
    id = Column(Integer, primary_key=True)
    name = Column(VARCHAR(100), nullable=False, unique=True)
    yes = Column(Integer, nullable=False, default=0)
    no = Column(Integer, nullable=False, default=0)
    ignore = Column(Integer, nullable=False, default=0)
    user_id = Column(Integer, ForeignKey('users.id'))

class Skill(BaseModel):
    __tablename__ = 'skills'
    id = Column(Integer, primary_key=True)
    name = Column(VARCHAR(100), nullable=False, unique=True)
    yes = Column(Integer, nullable=False, default=0)
    no = Column(Integer, nullable=False, default=0)
    ignore = Column(Integer, nullable=False, default=0)
    user_id = Column(Integer, ForeignKey('users.id'))

class Emotion(BaseModel):
    __tablename__ = 'emotions'
    id = Column(Integer, primary_key=True)
    name = Column(VARCHAR(100), nullable=False, unique=True)
    yes = Column(Integer, nullable=False, default=0)
    no = Column(Integer, nullable=False, default=0)
    ignore = Column(Integer, nullable=False, default=0)
    user_id = Column(Integer, ForeignKey('users.id'))

class Attitude(BaseModel):
    __tablename__ = 'attitudes'
    id = Column(Integer, primary_key=True)
    name = Column(VARCHAR(100), nullable=False, unique=True)
    yes = Column(Integer, nullable=False, default=0)
    no = Column(Integer, nullable=False, default=0)
    ignore = Column(Integer, nullable=False, default=0)
    user_id = Column(Integer, ForeignKey('users.id'))


class Character(BaseModel):
    __tablename__ = 'characters'
    id = Column(Integer, primary_key=True)
    name = Column(VARCHAR(100), nullable=False, unique=True)
    yes = Column(Integer, nullable=False, default=0)
    no = Column(Integer, nullable=False, default=0)
    ignore = Column(Integer, nullable=False, default=0)
    user_id = Column(Integer, ForeignKey('users.id'))


class Social(BaseModel):
    __tablename__ = 'socials'
    id = Column(Integer, primary_key=True)
    social_username = Column(VARCHAR(50), unique=True, nullable=False)
    social_id = Column(Integer, nullable=False, unique=True)
    role = Column(VARCHAR(20), nullable=False)
    verified = Column(Boolean, nullable=False, default=False)
    user_id = Column(Integer, ForeignKey('users.id'))




async def get_user(telegram_id: int, session_maker: sessionmaker) -> User:
    async with session_maker() as session:
        return await session.get(User, telegram_id)


async def create_user(telegram_id: int, username: str, session_maker: sessionmaker):
    seed = ' '.join(mnemonic_new())
    wallet = Wallets.from_mnemonics(seed.split(" "), WalletVersionEnum.v3r2, 0)
    async with session_maker() as session:
        await session.merge(User(id = telegram_id,
                                 username=username, seed = seed, address = wallet[3].address.to_string(True, True, True)))
        await session.commit()

