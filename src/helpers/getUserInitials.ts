export function getUserInitials(name: string): string {
    if (!name) return "?"; // Default placeholder if no name is provided
  
    const parts = name.trim().split(" ");
    const firstInitial = parts[0]?.charAt(0).toUpperCase() || "";
    const lastInitial = parts[1]?.charAt(0).toUpperCase() || "";
  
    return lastInitial ? `${firstInitial}${lastInitial}` : firstInitial;
  }