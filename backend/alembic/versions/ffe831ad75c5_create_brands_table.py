"""Create brands table and link capsules to brands.

Schema only: upgrade and downgrade require an empty capsules table.
"""

from alembic import op
import sqlalchemy as sa

revision = "ffe831ad75c5"
down_revision = "c34c11894742"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "brands",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(80), nullable=False, unique=True),
    )
    op.add_column("capsules", sa.Column("brand_id", sa.Integer(), nullable=False))
    op.create_foreign_key(
        "fk_capsules_brand_id", "capsules", "brands", ["brand_id"], ["id"]
    )
    op.create_index("ix_capsules_brand_id", "capsules", ["brand_id"])
    op.drop_column("capsules", "brand")


def downgrade() -> None:
    op.add_column("capsules", sa.Column("brand", sa.String(80), nullable=False))
    op.drop_index("ix_capsules_brand_id", table_name="capsules")
    op.drop_constraint("fk_capsules_brand_id", "capsules", type_="foreignkey")
    op.drop_column("capsules", "brand_id")
    op.drop_table("brands")
