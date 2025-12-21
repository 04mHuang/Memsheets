"""Update event reminder enum values

Revision ID: 6e0df99073f1
Revises: c5d407e61f62
Create Date: 2025-12-20 21:59:33.664924

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6e0df99073f1'
down_revision = 'c5d407e61f62'
branch_labels = None
depends_on = None


def upgrade():
    # Create new enum type
    op.execute("CREATE TYPE reminder_type_new AS ENUM ('None', 'Weekly', 'Monthly', 'Yearly')")
    
    with op.batch_alter_table('events', schema=None) as batch_op:
        batch_op.alter_column('reminder',
               existing_type=sa.Enum('none', 'weekly', 'monthly', 'yearly', name='reminder_type'),
               type_=sa.Enum('None', 'Weekly', 'Monthly', 'Yearly', name='reminder_type_new'),
               postgresql_using='INITCAP(reminder::text)::reminder_type_new')
    
    # Drop old enum type
    op.execute("DROP TYPE reminder_type")
    op.execute("ALTER TYPE reminder_type_new RENAME TO reminder_type")

def downgrade():
    # Create old enum type
    op.execute("CREATE TYPE reminder_type_old AS ENUM ('none', 'weekly', 'monthly', 'yearly')")
    
    with op.batch_alter_table('events', schema=None) as batch_op:
        batch_op.alter_column('reminder',
               existing_type=sa.Enum('None', 'Weekly', 'Monthly', 'Yearly', name='reminder_type'),
               type_=sa.Enum('none', 'weekly', 'monthly', 'yearly', name='reminder_type_old'),
               postgresql_using='LOWER(reminder::text)::reminder_type_old')
    
    # Drop new enum type
    op.execute("DROP TYPE reminder_type")
    op.execute("ALTER TYPE reminder_type_old RENAME TO reminder_type")
