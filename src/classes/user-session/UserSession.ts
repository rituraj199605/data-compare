/* ---------------------------------------------------------------
 * UserSession: typed wrapper around NextAuth session.
 * Rule 10: class in own folder. Rule 8: 1 class.
 * --------------------------------------------------------------- */

export class UserSession {
  readonly id: string;
  readonly email: string;
  readonly isAuthenticated: boolean;

  constructor(id: string, email: string) {
    this.id = id;
    this.email = email;
    this.isAuthenticated = id.length > 0 && email.length > 0;
  }

  /** Create a guest (unauthenticated) session. */
  static guest(): UserSession {
    return new UserSession("", "");
  }

  /** Create from a NextAuth session object. */
  static fromSession(session: {
    user?: { email?: string | null };
  } | null): UserSession {
    if (session === null || session === undefined) {
      return UserSession.guest();
    }
    const user = session.user;
    if (user === undefined || user === null) {
      return UserSession.guest();
    }
    const email: string = user.email ?? "";
    if (email.length === 0) {
      return UserSession.guest();
    }
    return new UserSession("1", email);
  }
}
