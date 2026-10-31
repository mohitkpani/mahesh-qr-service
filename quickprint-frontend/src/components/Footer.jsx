function Footer() {
    return (
        <footer className="app-footer">
            <p>
                © {new Date().getFullYear()} Mahesh Digital Studio. All rights reserved.
            </p>
            <span>Your documents are used only for printing purposes.</span>
        </footer>
    );
}

export default Footer;