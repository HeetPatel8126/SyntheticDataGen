"""Add uploaded_files table for SDV uploads

Revision ID: 003_add_uploaded_files
Revises: 002_add_users
Create Date: 2026-02-26
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "003_add_uploaded_files"
down_revision: Union[str, None] = "002_add_users"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "uploaded_files",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("filename", sa.String(length=255), nullable=False),
        sa.Column("file_path", sa.String(length=500), nullable=False),
        sa.Column("model_path", sa.String(length=500), nullable=True),
        sa.Column("column_stats", postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column("row_count", sa.Integer(), nullable=True),
        sa.Column("column_count", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_uploaded_files_user_id"), "uploaded_files", ["user_id"], unique=False)
    op.create_index(op.f("ix_uploaded_files_created_at"), "uploaded_files", ["created_at"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_uploaded_files_created_at"), table_name="uploaded_files")
    op.drop_index(op.f("ix_uploaded_files_user_id"), table_name="uploaded_files")
    op.drop_table("uploaded_files")

