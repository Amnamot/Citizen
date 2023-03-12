"""initial

Revision ID: cbd4c91e302e
Revises: 
Create Date: 2023-03-02 23:39:47.273830

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cbd4c91e302e'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('telegram_id', sa.Integer(), nullable=False),
    sa.Column('seed', sa.VARCHAR(length=320), nullable=False),
    sa.Column('token_url', sa.VARCHAR(length=80), nullable=True),
    sa.PrimaryKeyConstraint('telegram_id'),
    sa.UniqueConstraint('seed'),
    sa.UniqueConstraint('telegram_id'),
    sa.UniqueConstraint('token_url')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('users')
    # ### end Alembic commands ###