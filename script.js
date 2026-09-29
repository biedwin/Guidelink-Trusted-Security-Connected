const modal = document.getElementById("authModal");
const roleChooser = document.getElementById("roleChooser");
const userForm = document.getElementById("userForm");
const companyForm = document.getElementById("companyForm");

const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");

const companySearch = document.getElementById("companySearch");
const serviceFilter = document.getElementById("serviceFilter");
const companyGrid = document.getElementById("companyGrid");

const defaultCompanies = [
    {
        id: 1,
        name: "Shield Secure Services",
        initials: "SS",
        location: "Lagos",
        services: ["guard", "estate"],
        price: "₦80,000+",
        description: "Professional guarding and estate protection services.",
        verified: true
    },

    {
        id: 2,
        name: "Prime Guard Nigeria",
        initials: "PG",
        location: "Port Harcourt",
        services: ["guard", "event"],
        price: "₦75,000+",
        description: "Guarding personnel and event security solutions.",
        verified: true
    },

    {
        id: 3,
        name: "SafeWatch Protection",
        initials: "SW",
        location: "Abuja",
        services: ["estate", "escort"],
        price: "₦90,000+",
        description: "Residential protection, escort and access-control services.",
        verified: true
    }
];


/* =========================================================
   3. LOCAL STORAGE
   ========================================================= */

function getUsers() {
    return JSON.parse(localStorage.getItem("guideLinkUsers")) || [];
}

function getCompanies() {
    const savedCompanies =
        JSON.parse(localStorage.getItem("guideLinkCompanies"));

    return savedCompanies || defaultCompanies;
}

function saveUsers(users) {
    localStorage.setItem(
        "guideLinkUsers",
        JSON.stringify(users)
    );
}

function saveCompanies(companies) {
    localStorage.setItem(
        "guideLinkCompanies",
        JSON.stringify(companies)
    );
}


/* =========================================================
   4. MODAL FUNCTIONS
   ========================================================= */

function openAuth(type = "register") {

    if (!modal) return;

    modal.classList.add("show");

    showChooser();

    if (type === "login") {

        showLoginForm();

    } else {

        authTitle.textContent = "Join GuideLink";

        authSubtitle.textContent =
            "Choose how you want to use GuideLink.";
    }
}


function closeAuth() {

    if (!modal) return;

    modal.classList.remove("show");

    resetForms();
}


function showChooser() {

    roleChooser.style.display = "grid";

    userForm.classList.remove("active");
    companyForm.classList.remove("active");
}


/* =========================================================
   5. USER / COMPANY REGISTRATION SELECTION
   ========================================================= */

function showForm(type) {

    roleChooser.style.display = "none";

    if (type === "user") {

        authTitle.textContent =
            "Create your user account";

        authSubtitle.textContent =
            "Create your profile and complete KYC verification.";

        userForm.classList.add("active");

        companyForm.classList.remove("active");

    }

    if (type === "company") {

        authTitle.textContent =
            "Register your security company";

        authSubtitle.textContent =
            "Submit your company details for verification.";

        companyForm.classList.add("active");

        userForm.classList.remove("active");
    }
}


/* =========================================================
   6. LOGIN FORM
   ========================================================= */

function showLoginForm() {

    roleChooser.style.display = "none";

    userForm.classList.remove("active");
    companyForm.classList.remove("active");

    authTitle.textContent = "Welcome back";

    authSubtitle.textContent =
        "Login to your GuideLink account.";

    const existingLogin =
        document.getElementById("loginForm");

    if (existingLogin) {

        existingLogin.remove();
    }

    const loginForm =
        document.createElement("form");

    loginForm.id = "loginForm";

    loginForm.className = "auth-form active";

    loginForm.innerHTML = `

        <label>
            Email Address

            <input
                id="loginEmail"
                type="email"
                placeholder="Enter your email"
                required
            >
        </label>

        <label>
            Password

            <input
                id="loginPassword"
                type="password"
                placeholder="Enter your password"
                required
            >
        </label>

        <label>
            Account Type

            <select id="loginType" required>
                <option value="">Select account type</option>
                <option value="user">User</option>
                <option value="company">Security Company</option>
            </select>
        </label>

        <button
            type="submit"
            class="btn btn-primary full"
        >
            Login
        </button>

        <button
            type="button"
            class="text-btn"
            onclick="showChooser()"
        >
            Create an account instead
        </button>

    `;

    const modalCard =
        document.querySelector(".modal-card");

    modalCard.appendChild(loginForm);

    loginForm.addEventListener(
        "submit",
        handleLogin
    );
}


/* =========================================================
   7. USER REGISTRATION
   ========================================================= */

if (userForm) {

    userForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const inputs =
                userForm.querySelectorAll("input");

            const name =
                inputs[0].value.trim();

            const email =
                inputs[1].value.trim().toLowerCase();

            const phone =
                inputs[2].value.trim();

            const password =
                inputs[3].value;

            if (!name || !email || !phone || !password) {

                showNotification(
                    "Please complete all required fields.",
                    "error"
                );

                return;
            }

            if (password.length < 6) {

                showNotification(
                    "Password must contain at least 6 characters.",
                    "error"
                );

                return;
            }

            const users = getUsers();

            const alreadyExists =
                users.some(
                    user => user.email === email
                );

            if (alreadyExists) {

                showNotification(
                    "An account with this email already exists.",
                    "error"
                );

                return;
            }

            const newUser = {

                id: Date.now(),

                name: name,

                email: email,

                phone: phone,

                password: password,

                role: "user",

                kycStatus: "Pending",

                createdAt:
                    new Date().toISOString()

            };

            users.push(newUser);

            saveUsers(users);

            localStorage.setItem(
                "guideLinkCurrentUser",
                JSON.stringify(newUser)
            );

            closeAuth();

            showUserDashboard(newUser);
        }
    );
}


/* =========================================================
   8. COMPANY REGISTRATION
   ========================================================= */

if (companyForm) {

    companyForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const inputs =
                companyForm.querySelectorAll("input");

            const companyName =
                inputs[0].value.trim();

            const email =
                inputs[1].value.trim().toLowerCase();

            const phone =
                inputs[2].value.trim();

            const location =
                inputs[3].value.trim();

            const license =
                inputs[4].value.trim();

            const description =
                companyForm.querySelector("textarea").value.trim();

            if (
                !companyName ||
                !email ||
                !phone ||
                !location ||
                !license
            ) {

                showNotification(
                    "Please complete all required company information.",
                    "error"
                );

                return;
            }

            const companies =
                getCompanies();

            const newCompany = {

                id: Date.now(),

                name: companyName,

                initials:
                    getInitials(companyName),

                location: location,

                services: ["guard"],

                price: "Contact company",

                description:
                    description ||
                    "Professional private security services.",

                verified: false,

                license: license,

                email: email,

                phone: phone,

                verificationStatus: "Pending",

                createdAt:
                    new Date().toISOString()

            };

            companies.push(newCompany);

            saveCompanies(companies);

            closeAuth();

            showCompanyDashboard(newCompany);

            renderCompanies();
        }
    );
}


/* =========================================================
   9. LOGIN
   ========================================================= */

function handleLogin(event) {

    event.preventDefault();

    const email =
        document
            .getElementById("loginEmail")
            .value
            .trim()
            .toLowerCase();

    const password =
        document
            .getElementById("loginPassword")
            .value;

    const accountType =
        document
            .getElementById("loginType")
            .value;

    const users = getUsers();

    const companies = getCompanies();

    let account = null;

    if (accountType === "user") {

        account = users.find(
            user =>
                user.email === email &&
                user.password === password
        );
    }

    if (accountType === "company") {

        account = companies.find(
            company =>
                company.email === email
        );
    }

    if (!account) {

        showNotification(
            "Login details could not be verified.",
            "error"
        );

        return;
    }

    localStorage.setItem(
        "guideLinkCurrentUser",
        JSON.stringify(account)
    );

    closeAuth();

    if (accountType === "user") {

        showUserDashboard(account);

    } else {

        showCompanyDashboard(account);
    }
}


/* =========================================================
   10. USER DASHBOARD
   ========================================================= */

function showUserDashboard(user) {

    const name =
        user.name || "GuideLink User";

    showNotification(
        `Welcome, ${name}! Your account has been created.`,
        "success"
    );

    setTimeout(() => {

        alert(

            `GUIDELINK USER DASHBOARD\n\n` +

            `Welcome: ${name}\n\n` +

            `KYC Status: ${user.kycStatus || "Pending"}\n\n` +

            `From your dashboard you will be able to:\n` +

            `• Complete KYC verification\n` +

            `• Search security companies\n` +

            `• Compare services\n` +

            `• View prices\n` +

            `• Read company terms\n` +

            `• Request security personnel\n` +

            `• Manage bookings\n` +

            `• Submit reviews and complaints`

        );

    }, 500);
}


/* =========================================================
   11. COMPANY DASHBOARD
   ========================================================= */

function showCompanyDashboard(company) {

    showNotification(
        "Security company registration submitted.",
        "success"
    );

    setTimeout(() => {

        alert(

            `GUIDELINK COMPANY DASHBOARD\n\n` +

            `Company: ${company.name}\n\n` +

            `Location: ${company.location}\n\n` +

            `Verification: Pending\n\n` +

            `Your dashboard will allow you to:\n` +

            `• Manage company profile\n` +

            `• Upload verification documents\n` +

            `• Add security services\n` +

            `• Set guard prices\n` +

            `• Publish terms of service\n` +

            `• Receive booking requests\n` +

            `• Manage security personnel\n` +

            `• View customer feedback`

        );

    }, 500);
}


/* =========================================================
   12. COMPANY SEARCH
   ========================================================= */

function filterCompanies() {

    const search =
        companySearch
            ? companySearch.value
                .toLowerCase()
                .trim()
            : "";

    const service =
        serviceFilter
            ? serviceFilter.value
            : "";

    const cards =
        document.querySelectorAll(
            ".company-card"
        );

    let visibleCount = 0;

    cards.forEach(card => {

        const searchText =
            card.dataset.search
                ? card.dataset.search.toLowerCase()
                : "";

        const services =
            card.dataset.service
                ? card.dataset.service.toLowerCase()
                : "";

        const searchMatch =
            !search ||
            searchText.includes(search);

        const serviceMatch =
            !service ||
            services.includes(service);

        if (searchMatch && serviceMatch) {

            card.style.display = "block";

            visibleCount++;

        } else {

            card.style.display = "none";
        }
    });

    updateSearchMessage(visibleCount);
}


/* =========================================================
   13. RENDER COMPANY CARDS
   ========================================================= */

function renderCompanies() {

    if (!companyGrid) return;

    const companies =
        getCompanies();

    companyGrid.innerHTML = "";

    companies.forEach(company => {

        const card =
            document.createElement("article");

        card.className =
            "company-card";

        card.dataset.search =
            `${company.name} ${company.location} ${company.description}`;

        card.dataset.service =
            company.services.join(" ");

        card.innerHTML = `

            <div class="company-top">

                <div class="company-logo">
                    ${company.initials}
                </div>

                ${company.verified

                ?

                `<span class="verified">
                        ✓ Verified
                    </span>`

                :

                `<span class="verified"
                           style="background:#fff4d2;color:#8a6919;">
                        Pending
                    </span>`
            }

            </div>

            <h3>${company.name}</h3>

            <p>
                ${company.description}
            </p>

            <div class="company-meta">

                <span>
                    📍 ${company.location}
                </span>

                <span>
                    ${company.price}
                </span>

            </div>

            <button
                class="company-link"
                onclick="showCompany(${company.id})"
            >
                View Profile →
            </button>
        `;

        companyGrid.appendChild(card);
    });
}


/* =========================================================
   14. COMPANY PROFILE
   ========================================================= */

function showCompany(companyId) {

    const companies =
        getCompanies();

    const company =
        companies.find(
            item => item.id == companyId
        );

    if (!company) {

        showNotification(
            "Company information not found.",
            "error"
        );

        return;
    }

    const modalBox =
        document.createElement("div");

    modalBox.className =
        "modal show";

    modalBox.id =
        "companyProfileModal";

    modalBox.innerHTML = `

        <div class="modal-card">

            <button
                class="close"
                onclick="closeCompanyProfile()"
            >
                ×
            </button>

            <div class="company-logo">
                ${company.initials}
            </div>

            <h2 style="margin-top:15px;color:#08264A;">
                ${company.name}
            </h2>

            <p style="color:#708196;">
                📍 ${company.location}
            </p>

            <hr style="
                margin:20px 0;
                border:none;
                border-top:1px solid #DCE6ED;
            ">

            <h4>About the Company</h4>

            <p style="
                color:#708196;
                margin:8px 0 20px;
            ">
                ${company.description}
            </p>

            <h4>Services</h4>

            <p style="
                color:#708196;
                margin:8px 0;
            ">
                ${formatServices(company.services)}
            </p>

            <h4 style="margin-top:15px;">
                Starting Price
            </h4>

            <p style="
                color:#00877B;
                font-weight:700;
                margin:5px 0 15px;
            ">
                ${company.price}
            </p>

            <h4>Verification</h4>

            <p style="
                color:#708196;
                margin:5px 0 20px;
            ">
                ${company.verified
            ? "✓ Company verified"
            : "Verification pending"
        }
            </p>

            <button
                class="btn btn-primary full"
                onclick="requestSecurity(${company.id})"
            >
                Request Security Personnel
            </button>

        </div>
    `;

    document.body.appendChild(modalBox);
}


function closeCompanyProfile() {

    const profile =
        document.getElementById(
            "companyProfileModal"
        );

    if (profile) {

        profile.remove();
    }
}


/* =========================================================
   15. REQUEST SECURITY
   ========================================================= */

function requestSecurity(companyId) {

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "guideLinkCurrentUser"
            )
        );

    if (!currentUser) {

        closeCompanyProfile();

        openAuth("login");

        showNotification(
            "Please login before requesting security.",
            "error"
        );

        return;
    }

    const companies =
        getCompanies();

    const company =
        companies.find(
            item => item.id == companyId
        );

    if (!company) return;

    closeCompanyProfile();

    alert(

        `SECURITY REQUEST\n\n` +

        `Company: ${company.name}\n` +

        `Location: ${company.location}\n` +

        `Starting Price: ${company.price}\n\n` +

        `Next step in the full application:\n` +

        `1. Select security service\n` +

        `2. Select date and duration\n` +

        `3. Review company terms\n` +

        `4. Sign service agreement\n` +

        `5. Make payment\n` +

        `6. Receive booking confirmation`

    );
}


/* =========================================================
   16. KYC DEMO
   ========================================================= */

function startKYC() {

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "guideLinkCurrentUser"
            )
        );

    if (!currentUser) {

        showNotification(
            "Please login first.",
            "error"
        );

        return;
    }

    currentUser.kycStatus =
        "Submitted";

    localStorage.setItem(
        "guideLinkCurrentUser",
        JSON.stringify(currentUser)
    );

    const users = getUsers();

    const index =
        users.findIndex(
            user =>
                user.email === currentUser.email
        );

    if (index !== -1) {

        users[index].kycStatus =
            "Submitted";

        saveUsers(users);
    }

    showNotification(
        "KYC information submitted for verification.",
        "success"
    );
}


/* =========================================================
   17. NOTIFICATION SYSTEM
   ========================================================= */

function showNotification(
    message,
    type = "success"
) {

    const notification =
        document.createElement("div");

    notification.className =
        "guide-notification";

    notification.textContent =
        message;

    notification.style.position =
        "fixed";

    notification.style.top =
        "95px";

    notification.style.right =
        "20px";

    notification.style.zIndex =
        "1000";

    notification.style.padding =
        "15px 20px";

    notification.style.borderRadius =
        "10px";

    notification.style.color =
        "white";

    notification.style.fontSize =
        "14px";

    notification.style.fontWeight =
        "600";

    notification.style.boxShadow =
        "0 10px 30px rgba(0,0,0,.18)";

    notification.style.background =
        type === "error"
            ? "#C0392B"
            : "#00877B";

    document.body.appendChild(
        notification
    );

    setTimeout(() => {

        notification.remove();

    }, 3500);
}


/* =========================================================
   18. SEARCH RESULT MESSAGE
   ========================================================= */

function updateSearchMessage(count) {

    let message =
        document.getElementById(
            "searchResultMessage"
        );

    if (!message) {

        message =
            document.createElement("p");

        message.id =
            "searchResultMessage";

        message.style.textAlign =
            "center";

        message.style.color =
            "#708196";

        message.style.marginBottom =
            "20px";

        if (companyGrid) {

            companyGrid.parentNode.insertBefore(
                message,
                companyGrid
            );
        }
    }

    if (count === 0) {

        message.textContent =
            "No security companies match your search.";

    } else {

        message.textContent =
            `${count} security ${count === 1
                ? "company"
                : "companies"
            } found.`;
    }
}


/* =========================================================
   19. MOBILE MENU
   ========================================================= */

function toggleMenu() {

    const nav =
        document.querySelector(
            ".nav-links"
        );

    if (!nav) return;

    if (
        nav.style.display === "flex"
    ) {

        nav.style.display = "none";

        return;
    }

    nav.style.display = "flex";

    nav.style.position = "absolute";

    nav.style.top = "78px";

    nav.style.left = "0";

    nav.style.right = "0";

    nav.style.background = "white";

    nav.style.padding = "20px";

    nav.style.flexDirection = "column";

    nav.style.borderBottom =
        "1px solid #DCE6ED";
}


/* =========================================================
   20. SCROLL TO SECTION
   ========================================================= */

function scrollToSection(id) {

    const section =
        document.getElementById(id);

    if (!section) return;

    section.scrollIntoView({
        behavior: "smooth"
    });
}


/* =========================================================
   21. HELPER FUNCTIONS
   ========================================================= */

function getInitials(name) {

    return name
        .split(" ")
        .filter(word => word.length > 0)
        .slice(0, 2)
        .map(word => word[0])
        .join("")
        .toUpperCase();
}


function formatServices(services) {

    const names = {

        guard: "Security Guards",

        event: "Event Security",

        estate: "Estate Security",

        escort: "Escort Services"
    };

    return services
        .map(
            service =>
                names[service] || service
        )
        .join(" • ");
}


function resetForms() {

    if (userForm) {

        userForm.reset();

        userForm.classList.remove(
            "active"
        );
    }

    if (companyForm) {

        companyForm.reset();

        companyForm.classList.remove(
            "active"
        );
    }

    const loginForm =
        document.getElementById(
            "loginForm"
        );

    if (loginForm) {

        loginForm.remove();
    }
}


/* =========================================================
   22. LOGOUT
   ========================================================= */

function logoutGuideLink() {

    localStorage.removeItem(
        "guideLinkCurrentUser"
    );

    showNotification(
        "You have been logged out.",
        "success"
    );
}


/* =========================================================
   23. CLOSE MODAL WHEN CLICKING OUTSIDE
   ========================================================= */

if (modal) {

    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                closeAuth();
            }
        }
    );
}


/* =========================================================
   24. ESC KEY CLOSES MODAL
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeAuth();

            closeCompanyProfile();
        }
    }
);


/* =========================================================
   25. SEARCH AS USER TYPES
   ========================================================= */

if (companySearch) {

    companySearch.addEventListener(
        "input",
        filterCompanies
    );
}

if (serviceFilter) {

    serviceFilter.addEventListener(
        "change",
        filterCompanies
    );
}


/* =========================================================
   26. INITIALIZE APPLICATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderCompanies();

        updateSearchMessage(
            getCompanies().length
        );

        console.log(
            "GuideLink application loaded successfully."
        );
    }
);

