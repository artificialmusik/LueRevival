# AlpacaBoards to LueRevival feature parity map

| AlpacaBoards item | Status in LueRevival |
|---|---|
| Users, login, profile, signature, quote, timezone | Implemented, with reference-style user information page, picture URL, admin/mod tag lists, and good/bad tokens |
| Staff positions / admin permissions | Implemented as staff position + access level; permissions JSON ready for expansion |
| Site options: site name, registration, invites | Implemented |
| Topics and messages | Implemented |
| Message edits and history | Implemented via `message_revisions` |
| Soft-delete messages/links | Implemented for messages/topics; links can be deactivated by extending admin report flow |
| Topic locking/pinning | Implemented |
| Topical tags | Implemented, with reference-style edit page for description, access, participation, restrictions, interactions, moderators, and administrators |
| Link directory, link messages, votes, favorites, reports | Implemented |
| Invites, invite tree | Implemented |
| Shop/inventory | Implemented with Invite and Pin Topic item seeds |
| Discipline history / user control | Implemented |
| Uploaded images | Implemented upload registry/gallery |
| Image maps | Schema implemented, UI endpoint future work |
| Sphinx search | Replaced by Postgres FTS |
| Live message updates | Future: add SSE/WebSocket without changing DB model |
| Private messages | Future extension |
| Email/password reset | SMTP placeholders included, future extension |
