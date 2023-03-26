import os
from typing import Union

import sqlalchemy.ext.asyncio
from sqlalchemy import MetaData
from sqlalchemy.engine import URL
from sqlalchemy.ext.asyncio import create_async_engine as _create_async_engine
from sqlalchemy.orm import sessionmaker


def create_async_engine(url: Union[URL, str]) -> sqlalchemy.ext.asyncio.AsyncEngine:
    return _create_async_engine(url=url, echo=bool(os.getenv('debug')), encoding='utf-8', pool_pre_ping=True)



def get_session_maker(engine: sqlalchemy.ext.asyncio.AsyncEngine) -> sessionmaker:
    return sessionmaker(engine, class_=sqlalchemy.ext.asyncio.AsyncSession, expire_on_commit=False)