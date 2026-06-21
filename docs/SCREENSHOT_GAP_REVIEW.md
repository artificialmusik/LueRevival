# Screenshot gap review

Compared the new reference screenshots against the initial LueRevival implementation before adding this pass.

## Already present before this pass

- Purple/gray nblue-style board skin from AlpacaBoards.
- Login/register/profile routes.
- User status, karma, staff/access-level controls.
- Tag CRUD basics: title, description, access, participation, permanent, special.
- Post-login board/topic list.

## Missing or too thin before this pass

1. **Individual user pages** were functional but generic. They did not match the reference `User Information Page`, and lacked User ID, admin/moderator tag lists, good/bad token split, last active in old format, email/IM rows, picture row, and token actions.
2. **Pre-login landing** did not exist as a standalone old-school page. Anonymous visitors only saw the board list/login links instead of the TF4-style orange burned header, left login box, and latest-articles column.
3. **Tag editing** was a compact single-line admin form. It lacked fieldset sections for Description, Access, Participation, Restrictions, Interactions, Moderators, and Administrators.
4. **First-login/front page** was a standard board list, not the EOTI-style grouped `[Tag] of the Moment` page with a right poll/sidebar and active tag cloud.

## Included in this pass

- Added anonymous TF4-style landing page at `/` when logged out.
- Added logged-in EOTI-style front page at `/` when logged in.
- Expanded user profile page to match the User Information reference.
- Added user token actions and persisted good/bad token counts.
- Added full tag edit page at `/admin/tags/:id/edit` with the reference fieldsets/options.
- Added tag interaction/moderator/admin fields to the data model.
- Updated profile editing to include picture URL.

## Still intentionally future work

- Private-message implementation behind the `Private Messages` navigation.
- Real dynamic poll creation/results persistence; the front page currently renders the visual poll module as a UI scaffold.
- Full enforcement of tag interaction rules at posting time; the data model and edit UI now exist, but enforcement should be a follow-up so it can be tested carefully.
