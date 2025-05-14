export const validationRules = {
    name: [
        {
            rule: (val) => val.trim() !== '',
            message: 'Name is required',
        },
        {
            rule: (val) => val.length >= 3,
            message: 'Name must be at least 3 characters',
        },
    ],
    email: [
        {
            rule: (val) => val.trim() !== '',
            message: 'Email is required',
        },
        {
            rule: (val) => /\S+@\S+\.\S+/.test(val),
            message: 'Invalid email address',
        },
    ],
    phone: [
        {
            rule: (val) => val.trim() !== '',
            message: 'Mobile number is required',
        },
        {
            rule: (val) => /^[6-9]\d{9}$/.test(val),
            message: 'Invalid mobile number',
        },
    ],
    password: [
        {
            rule: (val) => val.trim() !== '',
            message: 'Password is required',
        },
        // {
        //     rule: (val) => val.length >= 6,
        //     message: 'Password must be at least 6 characters',
        // },
        // {
        //     rule: (val) => /[A-Z]/.test(val),
        //     message: 'Password must include at least one uppercase letter',
        // },
        // {
        //     rule: (val) => /[a-z]/.test(val),
        //     message: 'Password must include at least one lowercase letter',
        // },
        // {
        //     rule: (val) => /\d/.test(val),
        //     message: 'Password must include at least one number',
        // },
        // {
        //     rule: (val) => /[@$!%*?&#]/.test(val),
        //     message: 'Password must include at least one special character',
        // },
    ],
    confirmPassword : [
        {
            rule: (val) => val.trim() !== '',
            message: 'Password is required',
        },
        {
            rule: (val) => val.length >= 6,
            message: 'Password must be at least 6 characters',
        },
        {
            rule: (val) => /[A-Z]/.test(val),
            message: 'Password must include at least one uppercase letter',
        },
        {
            rule: (val) => /[a-z]/.test(val),
            message: 'Password must include at least one lowercase letter',
        },
        {
            rule: (val) => /\d/.test(val),
            message: 'Password must include at least one number',
        },
        {
            rule: (val) => /[@$!%*?&#]/.test(val),
            message: 'Password must include at least one special character',
        },
    ]
};
