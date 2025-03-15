const AuthLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className=" h-screen flex flex-col items-center justify-center bg-gradient-to-t from-sky-400 to-blue-800">
            {children}
        </div>
    )
}

export default AuthLayout;