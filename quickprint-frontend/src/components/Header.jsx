import { Printer } from "lucide-react";

function Header() {
    return (
        <header className="app-header">
            <div className="brand">
                <div className="brand-logo">MDS</div>

                <div className="brand-text">
                    <h1>Mahesh Digital Studio</h1>
                    <p>Upload Your Documents</p>
                </div>
            </div>

            <div className="header-printer">
                <Printer size={42} />
            </div>
        </header>
    );
}

export default Header;