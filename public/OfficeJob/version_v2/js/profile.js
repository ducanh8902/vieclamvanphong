
$(document).ready(function () {
    $("#loading").addClass('loading')
    $("#body").html(`<div class="row">
    <div style="text-align: center;" class="col-lg-12">
            <img style="width: 50%;" src="./logo_vlvp_new_2022.png" alt="">
    </div>
</div>`)
});
$('a[href="#btn_form_job_manager"]').click(function () {
    $("#loading").removeClass('loading')
    $("#body").html(`<iframe style="display: block;      
    background: #000;
    border: 2px solid gray;   
    border-radius:15px;     
    height: 80vh;       
    width: 100%;background-color:#fff" src="/Recruit_Manager"></iframe>`)
});
$('a[href="#btn__create_form_job"]').click(function () {
    $("#loading").removeClass('loading')
    $("#body").html(`<iframe style="display: block;      
    background: #000;
    border: 2px solid gray;   
    border-radius:15px;     
    height: 80vh;       
    width: 100%;;background-color:#fff" src="/create-form-job"></iframe>`)
});

$('a[href="#btn_eidt_image"]').click(function () {
    $("#loading").removeClass('loading')
    $("#body").html(`<iframe style="display: block;      
    background: #000;
    border: 2px solid gray;   
    border-radius:15px;     
    height: 80vh;       
    width: 100%;;background-color:#fff" src="https://pixlr.com/vn/x/"></iframe>`)
});
$('a[href="#btn_eidt_video"]').click(function () {
    $("#loading").removeClass('loading')
    $("#body").html(`<iframe style="display: block;      
    background: #000;
    border: 2px solid gray;   
    border-radius:15px;     
    height: 80vh;       
    width: 100%;;background-color:#fff" src="/banner_profile"></iframe>`)
});
$('a[href="#btn_eidt_video"]').click(function () {
    $("#loading").removeClass('loading')
    $("#body").html(`<iframe style="display: block;     
                background: #000;
                border: 2px solid gray;   
                border-radius:15px;     
                height: 80vh;       
                width: 100%;;background-color:#fff" src="/banner_profile"></iframe>`)
});
$('a[href="#btn_share_cv"]').click(function () {
    $("#loading").removeClass('loading')
    $("#body").html(`<iframe style="display: block;      
                background: #000;
                border: 2px solid gray;   
                border-radius:15px;     
                height: 80vh;       
                width: 100%;;background-color:#fff" src="./profile_share_cv"></iframe>`)
});
$('a[href="#edit_info"]').click(function () {
    var _id_user_login = $("#_id_user_login").val()
    $("#loading").removeClass('loading')
    $("#body").html(`<iframe style="display: block;      
                background: #000;
                border: 2px solid gray;   
                border-radius:15px;     
                height: 80vh;       
                width: 100%;;background-color:#fff" src="./edit_profile_v2/${_id_user_login}"></iframe>`)
});