export function parseFirebaseError(error: any): string {
    const code = error?.code || '';
  
    const messages: Record<string, string> = {
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/wrong-password': 'The password is incorrect.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed before completing.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      // Add more if needed
    };
  
    return messages[code] || 'An unexpected error occurred. Please try again.';
  }
  