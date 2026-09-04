alter table public.moderation_actions
drop constraint if exists moderation_actions_action_check;

alter table public.moderation_actions
add constraint moderation_actions_action_check
check (
  action in (
    'document_approved',
    'document_rejected',
    'document_returned_to_review',
    'document_deleted',
    'user_blocked',
    'user_unblocked'
  )
);

alter table public.moderation_actions
add column if not exists subject_reference text;

create or replace function public.delete_document_review_with_audit(
  p_review_id uuid,
  p_actor_user_id uuid,
  p_reason text
)
returns boolean
language plpgsql
security invoker
set search_path = public
as $$
declare
  deleted_review public.document_reviews%rowtype;
begin
  delete from public.document_reviews
  where id = p_review_id
  returning * into deleted_review;

  if not found then
    return false;
  end if;

  insert into public.moderation_actions (
    actor_user_id,
    target_user_id,
    document_review_id,
    subject_reference,
    action,
    reason
  ) values (
    p_actor_user_id,
    deleted_review.user_id,
    null,
    'Document ' || left(deleted_review.id::text, 8) || ' · ' || left(deleted_review.original_filename, 120),
    'document_deleted',
    p_reason
  );

  return true;
end;
$$;

revoke all on function public.delete_document_review_with_audit(uuid, uuid, text)
from public, anon, authenticated;

grant execute on function public.delete_document_review_with_audit(uuid, uuid, text)
to service_role;
