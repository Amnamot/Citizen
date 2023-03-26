"""username

Revision ID: 94b84eeb5135
Revises: 0ee4c5fcfb7d
Create Date: 2023-03-15 19:41:31.646136

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '94b84eeb5135'
down_revision = '0ee4c5fcfb7d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('ispassport', sa.Boolean(), nullable=True))
    op.drop_column('users', 'istoken')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('istoken', sa.BOOLEAN(), autoincrement=False, nullable=True))
    op.drop_column('users', 'ispassport')
    # ### end Alembic commands ###