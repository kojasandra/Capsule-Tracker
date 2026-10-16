"""Create flavor notes table and capsule-to-note links.

Schema only: upgrade removes the old notes text; downgrade requires an empty
capsules table to restore the required text column without backfilling it.
"""

from alembic import op
import sqlalchemy as sa

revision = "ac41b57d2bce"
down_revision = "ffe831ad75c5"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "flavor_notes",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(2000), nullable=False, unique=True),
    )
    op.create_table(
        "capsule_flavor_notes",
        sa.Column(
            "capsule_id", sa.Integer(),
            sa.ForeignKey("capsules.id", ondelete="CASCADE"), primary_key=True,
        ),
        sa.Column(
            "flavor_note_id", sa.Integer(),
            sa.ForeignKey("flavor_notes.id", ondelete="CASCADE"), primary_key=True,
        ),
    )
    op.drop_column("capsules", "flavor_notes")


def downgrade() -> None:
    op.add_column("capsules", sa.Column("flavor_notes", sa.Text(), nullable=False))
    op.drop_table("capsule_flavor_notes")
    op.drop_table("flavor_notes")
