"use client"

import { logout } from "@/actions/logout";

const SettingsPage = () => {
    const onClick = () => {
        logout();
    }
    
  return (
    <div>
        <div className = "bg-white p-4 rounded-lg shadow-md">
            <button type="submit" onClick={onClick}>
                Logout
            </button>
        </div>
    </div>
  )
}

export default SettingsPage