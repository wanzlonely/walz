alter table public.chat_conversations
  add column if not exists user_name text,
  add column if not exists last_message text,
  add column if not exists last_message_at timestamptz,
  add column if not exists last_sender_type text,
  add column if not exists unread_by_owner integer not null default 0,
  add column if not exists unread_by_user integer not null default 0;

create index if not exists idx_chat_conv_last_msg_at
  on public.chat_conversations (last_message_at desc nulls last);

create index if not exists idx_chat_conv_unread
  on public.chat_conversations (unread_by_owner desc)
  where unread_by_owner > 0;

create index if not exists idx_chat_conv_status
  on public.chat_conversations (status);

create index if not exists idx_chat_conv_telegram
  on public.chat_conversations (telegram_id);

create index if not exists idx_chat_msg_conv_created
  on public.chat_messages (conversation_id, created_at desc);

update public.chat_conversations c
set
  last_message = lm.message,
  last_message_at = lm.created_at,
  last_sender_type = lm.sender_type,
  unread_by_owner = coalesce((
    select count(*)
    from public.chat_messages m
    where m.conversation_id = c.id
      and m.sender_type = 'user'
      and m.read_at is null
  ), 0),
  unread_by_user = coalesce((
    select count(*)
    from public.chat_messages m
    where m.conversation_id = c.id
      and m.sender_type = 'owner'
      and m.read_at is null
  ), 0)
from (
  select distinct on (conversation_id)
    conversation_id,
    message,
    created_at,
    sender_type
  from public.chat_messages
  order by conversation_id, created_at desc
) lm
where lm.conversation_id = c.id;

create or replace function public.chat_on_message_insert()
returns trigger
language plpgsql
as $$
begin
  update public.chat_conversations
  set
    last_message = left(new.message, 200),
    last_message_at = new.created_at,
    last_sender_type = new.sender_type,
    updated_at = now(),
    status = case
      when new.sender_type = 'user' then 'open'
      else status
    end,
    unread_by_owner = unread_by_owner +
      case when new.sender_type = 'user' then 1 else 0 end,
    unread_by_user = unread_by_user +
      case when new.sender_type = 'owner' then 1 else 0 end
  where id = new.conversation_id;

  return new;
end
$$;

drop trigger if exists trg_chat_on_message_insert
on public.chat_messages;

create trigger trg_chat_on_message_insert
after insert on public.chat_messages
for each row
execute function public.chat_on_message_insert();

do $$
begin
  begin
    alter publication supabase_realtime
    add table public.chat_messages;
  exception when duplicate_object then null;
  end;

  begin
    alter publication supabase_realtime
    add table public.chat_conversations;
  exception when duplicate_object then null;
  end;
end
$$;