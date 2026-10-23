-- =====================================================================
-- Fotos colocadas pela Kapazi nos produtos do site de pedidos (página fotos.html).
-- Roda no Supabase do gerador (Export Link), depois do 05. Pode rodar de novo sem problema.
--
-- Só quem é membro do gerador (login do Export Link, tabela membros) sobe ou apaga foto.
-- Os clientes (sem login) só VEEM as fotos: bucket público "fotos-pedido" + leitura da tabela.
-- Preços, clientes e documentos continuam fechados.
-- =====================================================================

create table if not exists public.fotos_pedido (
  cod        text not null,
  caminho    text not null primary key,          -- caminho no bucket "fotos-pedido"
  criado_em  timestamptz not null default now(),
  criado_por text default (auth.jwt() ->> 'email')
);
create index if not exists fotos_pedido_cod on public.fotos_pedido (cod);

alter table public.fotos_pedido enable row level security;
drop policy if exists "todos veem" on public.fotos_pedido;
drop policy if exists "membros gravam" on public.fotos_pedido;
drop policy if exists "membros apagam" on public.fotos_pedido;
create policy "todos veem"     on public.fotos_pedido for select to anon, authenticated using (true);
create policy "membros gravam" on public.fotos_pedido for insert to authenticated with check (public.eh_membro());
create policy "membros apagam" on public.fotos_pedido for delete to authenticated using (public.eh_membro());
grant select on public.fotos_pedido to anon;
grant select, insert, delete on public.fotos_pedido to authenticated;

-- bucket público (só leitura para todos), até 5 MB por foto, só imagens
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos-pedido', 'fotos-pedido', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "fotos-pedido membros leem" on storage.objects;
drop policy if exists "fotos-pedido membros gravam" on storage.objects;
drop policy if exists "fotos-pedido membros alteram" on storage.objects;
drop policy if exists "fotos-pedido membros apagam" on storage.objects;
create policy "fotos-pedido membros leem"    on storage.objects for select to authenticated using (bucket_id = 'fotos-pedido' and public.eh_membro());
create policy "fotos-pedido membros gravam"  on storage.objects for insert to authenticated with check (bucket_id = 'fotos-pedido' and public.eh_membro());
create policy "fotos-pedido membros alteram" on storage.objects for update to authenticated using (bucket_id = 'fotos-pedido' and public.eh_membro());
create policy "fotos-pedido membros apagam"  on storage.objects for delete to authenticated using (bucket_id = 'fotos-pedido' and public.eh_membro());

select 'Fotos do site de pedidos liberadas' as resultado;
