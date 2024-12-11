<template>
    <el-row class="login-contarner" justify="center" :align="'middle'">
        <el-card style="max-width: 480px">
            <template #header>
                <div class="card-header">
                    <img class="card-header-img" :src="imgUrl" alt="login-header" />
                </div>
            </template>
            <div class="jump-link">
                <el-link target="_blank" type="success" @click="handleChange">{{ formType ? '注册' : '登录' }}</el-link>
            </div>
            <el-form ref="loginFormRef" :model="loginForm" :rules="rules" style="max-width: 600px"
                class="demo-ruleForm">
                <el-form-item prop="userName">
                    <el-input v-model="loginForm.userName" placeholder="手机号" :prefix-icon="'UserFilled'" />
                </el-form-item>
                <el-form-item prop="passWord">
                    <el-input v-model="loginForm.passWord" type="password" placeholder="密码" show-password
                        :prefix-icon="'Lock'" />
                </el-form-item>
                <el-form-item v-if="!formType" prop="validCode">
                    <el-input v-model="loginForm.validCode" placeholder="验证码" :prefix-icon="'Lock'">
                        <template #append>
                            <span @click="countdownChange">{{ countdown.validText }}</span>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" :style="{ width: '100%' }" @click="submitForm(loginFormRef)">
                        {{ formType ? '登录' : '注册' }}
                    </el-button>
                </el-form-item>
            </el-form>
            <template class="card-footer" #footer>
                <span>DIDI陪诊后台管理系统</span>
            </template>
        </el-card>
    </el-row>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { getCode, login, userAuthentication } from '../../api/index.js';
import { useRouter } from 'vue-router';
const imgUrl = new URL('../../../public/login-header.png', import.meta.url).href;

// 表单初始数据
const loginForm = reactive({
    userName: '', //用户
    passWord: '', //密码
    validCode: '' //验证码
});

// 切换表单(true登录 false注册)
const formType = ref(true);

// 发送短信
const countdown = reactive({
    validText: '获取验证码',
    time: 60
});

/**
 * 账号校验
 */
const validateUser = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入账号'));
    } else {
        const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
        phoneReg.test(value) ? callback() : callback(new Error('手机号格式不对，请输入正确手机号'));
    }
};

/**
 * 密码校验
 */
const validatePass = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入密码'));
    } else {
        const reg = /^[a-zA-Z0-9_-]{4,16}$/;
        reg.test(value) ? callback() : callback(new Error('密码格式不对，需要4到16位字符，请确认格式'));
    }
};

/**
 * 表单校验规则
 */
const rules = reactive({
    userName: [{ validator: validateUser, trigger: 'blur' }],
    passWord: [{ validator: validatePass, trigger: 'blur' }]
});

/**
 *  切换表单
 */
const handleChange = () => {
    formType.value = !formType.value;
};

// 倒计时是否触发
let flag = ref(false);

/**
 *  触发倒计时
 */
const countdownChange = async () => {
    // 如果倒计时还在开着，则直接返回
    if (flag.value) return;
    // 判断手机号是否正确
    const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
    if (!loginForm.userName || !phoneReg.test(loginForm.userName)) {
        return ElMessage.warning('请检查手机号是否正确');
    }
    // 倒计时
    const time = setInterval(() => {
        if (countdown.time <= 0) {
            countdown.time = 60;
            countdown.validText = '获取验证码';
            flag.value = false;
            clearInterval(time);
        } else {
            countdown.time -= 1;
            countdown.validText = `${countdown.time}s后重新获取`;
        }
    }, 1000);
    flag.value = true;
    const res = await getCode({ tel: loginForm.userName });
    console.log(res, 'res');
    if (res.data && res.data.code === 10000) {
        ElMessage.success('验证码发送成功');
    } else {
        ElMessage.error(res.msg || '验证码发送失败');
    }
};

const loginFormRef = ref();
const router = useRouter()
/**
 * 表单提交
 */
const submitForm = async (formEl) => {
    if (!formEl) return;
    // 手动触发校验
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            console.log('submit!');

            if (formType.value) {
                // 调用登录接口
                const res = await login(loginForm);
                if (res.data && res.data.code === 10000) {
                    ElMessage.success('登录成功');
                    //将token和用户信息缓存到浏览器
                    localStorage.setItem('pz_token', res.data.data.token);
                    localStorage.setItem('pz_userInfo', JSON.stringify(res.data.data.userInfo));
                    router.push({ path: '/' })
                } else {
                    ElMessage.error(res.msg || '登陆失败');
                }

            } else {
                //调用注册接口
                const res = await userAuthentication(loginForm);
                if (res.data && res.data.code === 10000) {
                    ElMessage.success('注册成功，请登录');
                    formType.value = true;
                } else {
                    ElMessage.error(res.msg || '注册失败');
                }
            }
        } else {
            console.log('error submit!', fields);
        }
    });
};
</script>

<style lang="less" scoped>
.login-contarner {
    height: 100%;
    background-color: rgba(#2ecc71, 0.3);

    .card-header {
        background-color: #2ecc71;

        .card-header-img {
            width: 430px;
        }
    }

    :deep(.el-card__header) {
        padding: 0;
    }

    .jump-link {
        text-align: right;
        margin-bottom: 10px;
    }

    :deep(.el-card__footer) {
        color: #2ecc71;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
