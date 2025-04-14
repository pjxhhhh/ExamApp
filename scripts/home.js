// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 获取反馈表单元素
    const feedbackForm = document.querySelector('.feedback-form');
    const feedbackInput = document.querySelector('.feedback-input');
    const submitButton = document.querySelector('.btn-submit');

    // 提交反馈
    submitButton.addEventListener('click', function() {
        const feedback = feedbackInput.value.trim();
        if (feedback) {
            // 获取现有反馈列表
            let feedbackList = JSON.parse(localStorage.getItem('userFeedback') || '[]');
            
            // 添加新反馈
            feedbackList.push({
                content: feedback,
                timestamp: new Date().toISOString()
            });
            
            // 保存到本地存储
            localStorage.setItem('userFeedback', JSON.stringify(feedbackList));
            
            // 清空输入框
            feedbackInput.value = '';
            
            // 显示提交成功提示
            alert('感谢您的反馈！');
        } else {
            alert('请输入您的反馈内容');
        }
    });
}); 