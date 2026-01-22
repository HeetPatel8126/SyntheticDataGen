"""Initial migration - create jobs and templates tables

Revision ID: 001_initial
Revises: 
Create Date: 2026-01-22

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001_initial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create job status enum
    job_status_enum = postgresql.ENUM(
        'pending', 'processing', 'completed', 'failed', 'cancelled',
        name='jobstatus',
        create_type=True
    )
    job_status_enum.create(op.get_bind(), checkfirst=True)
    
    # Create data type enum
    data_type_enum = postgresql.ENUM(
        'user', 'ecommerce', 'company', 'custom',
        name='datatype',
        create_type=True
    )
    data_type_enum.create(op.get_bind(), checkfirst=True)
    
    # Create output format enum
    output_format_enum = postgresql.ENUM(
        'csv', 'json',
        name='outputformat',
        create_type=True
    )
    output_format_enum.create(op.get_bind(), checkfirst=True)
    
    # Create templates table
    op.create_table(
        'templates',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('schema', postgresql.JSON(astext_type=sa.Text()), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('is_system', sa.Boolean(), default=False),
        sa.Column('user_id', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_templates_name'), 'templates', ['name'], unique=True)
    
    # Create jobs table
    op.create_table(
        'jobs',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', sa.String(255), nullable=True),
        sa.Column('data_type', sa.Enum('user', 'ecommerce', 'company', 'custom', name='datatype'), nullable=False),
        sa.Column('record_count', sa.Integer(), nullable=False),
        sa.Column('output_format', sa.Enum('csv', 'json', name='outputformat'), nullable=True),
        sa.Column('template_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('status', sa.Enum('pending', 'processing', 'completed', 'failed', 'cancelled', name='jobstatus'), nullable=True),
        sa.Column('progress', sa.Float(), default=0.0),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('retry_count', sa.Integer(), default=0),
        sa.Column('max_retries', sa.Integer(), default=3),
        sa.Column('file_path', sa.String(500), nullable=True),
        sa.Column('file_size', sa.Integer(), nullable=True),
        sa.Column('metadata', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('started_at', sa.DateTime(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['template_id'], ['templates.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_jobs_created_at'), 'jobs', ['created_at'], unique=False)
    op.create_index(op.f('ix_jobs_status'), 'jobs', ['status'], unique=False)
    op.create_index(op.f('ix_jobs_user_id'), 'jobs', ['user_id'], unique=False)


def downgrade() -> None:
    # Drop jobs table
    op.drop_index(op.f('ix_jobs_user_id'), table_name='jobs')
    op.drop_index(op.f('ix_jobs_status'), table_name='jobs')
    op.drop_index(op.f('ix_jobs_created_at'), table_name='jobs')
    op.drop_table('jobs')
    
    # Drop templates table
    op.drop_index(op.f('ix_templates_name'), table_name='templates')
    op.drop_table('templates')
    
    # Drop enums
    op.execute('DROP TYPE IF EXISTS jobstatus')
    op.execute('DROP TYPE IF EXISTS datatype')
    op.execute('DROP TYPE IF EXISTS outputformat')
