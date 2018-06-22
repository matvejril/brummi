function validation() {
    $(".subscription-form").validate({
        rules: {
            email: {
                required: true,
                email: true
            }
        }
    });

    $(".sing-in__form").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 5
            }
        }
    });

    $(".sing-up__form").validate({
        rules: {
            // firstname: {
            //     required: true,
            //     minlength: 2
            // },
            // lastname: {
            //     required: true,
            //     minlength: 2
            // },
            // email: {
            //     required: true,
            //     email: true
            // },
            // password: {
            //     required: true,
            //     minlength: 5
            // },
            // confirm_password: {
            //     required: true,
            //     minlength: 5,
            //     equalTo: "#sing-up-pass"
            // },
            gender: {
                required: true
            }

            // subscribe1: {
            //     required: true
            // },
            // subscribe2: {
            //     required: true
            // }
        }
    })
}

module.exports = validation;



// $().ready(function() {
//
//     // validate signup form on keyup and submit
//     $("#signupForm").validate({
//         rules: {
//             firstname: "required",
//             lastname: "required",
//             username: {
//                 required: true,
//                 minlength: 2
//             },
//             password: {
//                 required: true,
//                 minlength: 5
//             },
//             confirm_password: {
//                 required: true,
//                 minlength: 5,
//                 equalTo: "#password"
//             },
//             email: {
//                 required: true,
//                 email: true
//             },
//             topic: {
//                 required: "#newsletter:checked",
//                 minlength: 2
//             },
//             agree: "required"
//         },
//         messages: {
//             firstname: "Please enter your firstname",
//             lastname: "Please enter your lastname",
//             username: {
//                 required: "Please enter a username",
//                 minlength: "Your username must consist of at least 2 characters"
//             },
//             password: {
//                 required: "Please provide a password",
//                 minlength: "Your password must be at least 5 characters long"
//             },
//             confirm_password: {
//                 required: "Please provide a password",
//                 minlength: "Your password must be at least 5 characters long",
//                 equalTo: "Please enter the same password as above"
//             },
//             email: "Please enter a valid email address",
//             agree: "Please accept our policy",
//             topic: "Please select at least 2 topics"
//         }
//     });
//
// });
