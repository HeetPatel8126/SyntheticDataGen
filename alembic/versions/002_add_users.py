"""Add users table for authentication

Revision ID: 002_add_users
Revises: 001_initial
Create Date: 2026-01-27

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '002_add_users'
down_revision: Union[str, None] = '001_initial'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('is_verified', sa.Boolean(), default=False),
        sa.Column('total_records_generated', sa.Integer(), default=0),
        sa.Column('storage_used', sa.Integer(), default=0),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('last_login', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    
    # Add data_type column to templates if not exists
    op.add_column('templates', sa.Column('data_type', sa.String(50), nullable=True))


def downgrade() -> None:
    # Remove data_type from templates
    op.drop_column('templates', 'data_type')
    
    # Drop users table
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
