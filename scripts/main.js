// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查当前页面
    if (document.querySelector('.home-container')) {
        return; // 首页不需要初始化功能页面
    }
    initAppPage();
});

// 初始化应用页面
function initAppPage() {
    // 初始化各个功能模块
    initNavigation();
    initTopicAnalysis();
    initWritingPlatform();
    initNotesPage();
    
    // 设置初始页面状态
    setDefaultPageState();
}

// 设置默认页面状态
function setDefaultPageState() {
    // 设置导航栏状态
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-page') === 'topic-analysis');
    });
    
    // 设置页面显示状态
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.toggle('active', page.id === 'topic-analysis');
    });
    
    // 设置题目解析页面的初始标签页
    switchTab('topic-reading');
}

// 初始化导航栏
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // 更新导航栏状态
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // 切换页面
            switchPage(item.getAttribute('data-page'));
        });
    });
}

// 切换页面
function switchPage(pageId) {
    // 更新页面显示状态
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.toggle('active', page.id === pageId);
    });
    
    // 如果切换到题目解析页面，显示题目导读标签页
    if (pageId === 'topic-analysis') {
        switchTab('topic-reading');
    }
}

// 切换标签页内容
function switchTab(tabId) {
    // 更新标签页按钮状态
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-tab') === tabId);
    });
    
    // 更新标签页内容
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => {
        pane.classList.toggle('active', pane.id === tabId);
    });
    
    // 如果切换到大纲助手，初始化相关功能
    if (tabId === 'outline-assistant') {
        initOutlineAssistant();
    }
}

// 初始化题目解析页面
function initTopicAnalysis() {
    // 初始化标签页
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // 初始化题目选择
    const essayTypeSelect = document.querySelector('.essay-type');
    const essayTopicSelect = document.querySelector('.essay-topic');
    
    if (essayTypeSelect && essayTopicSelect) {
        // 更新题目列表
        function updateTopicList() {
            essayTopicSelect.innerHTML = '';
            const selectedType = essayTypeSelect.value;
            const topics = essayTopics[selectedType];
            
            Object.keys(topics).reverse().forEach(year => {
                const yearGroup = document.createElement('optgroup');
                yearGroup.label = year + '年';
                
                topics[year].forEach(topic => {
                    const option = document.createElement('option');
                    option.value = topic.id;
                    option.textContent = `${topic.title}`;
                    yearGroup.appendChild(option);
                });
                
                essayTopicSelect.appendChild(yearGroup);
            });
            
            updateTopicContent();
        }

        // 更新题目内容
        function updateTopicContent() {
            const selectedType = essayTypeSelect.value;
            const selectedTopicId = essayTopicSelect.value;
            
            let selectedTopic = null;
            Object.values(essayTopics[selectedType]).forEach(yearTopics => {
                const topic = yearTopics.find(t => t.id === selectedTopicId);
                if (topic) selectedTopic = topic;
            });
            
            if (selectedTopic) {
                const textarea = document.querySelector('.input-container textarea');
                if (textarea) {
                    textarea.value = selectedTopic.content;
                }
            }
        }

        essayTypeSelect.addEventListener('change', updateTopicList);
        essayTopicSelect.addEventListener('change', updateTopicContent);
        updateTopicList(); // 初始化题目列表
    }

    // 初始化输入区域
    const textarea = document.querySelector('.input-container textarea');
    const btnSend = document.querySelector('.btn-send');
    const btnNext = document.querySelector('.btn-next');
    
    if (textarea && btnSend) {
        btnSend.addEventListener('click', function() {
            const content = textarea.value.trim();
            if (content) {
                // 调用题目解析服务
                analyzeTopic(content);
            }
        });
    }

    if (btnNext) {
        btnNext.addEventListener('click', function() {
            // 先找到大纲助手标签页按钮
            const outlineTab = document.querySelector('[data-tab="outline-assistant"]');
            if (outlineTab) {
                // 触发标签页按钮的点击事件
                outlineTab.click();
            } else {
                // 如果找不到按钮，直接调用switchTab
                switchTab('outline-assistant');
            }
        });
    }
}

// 题目解析服务
function analyzeTopic(content) {
    // 模拟题目解析服务
    const analysis = {
        title: "题目解析",
        sections: [
            {
                title: "题目解析",
                content: "分析题目要求，明确写作方向和重点"
            },
            {
                title: "格式要求",
                content: "明确文章结构、段落安排和字数要求"
            },
            {
                title: "多维分析",
                content: "从多个角度分析题目，提供写作思路"
            },
            {
                title: "示范论文",
                content: "提供一篇优秀的范文作为参考"
            },
            {
                title: "避坑指南",
                content: "指出常见错误和注意事项"
            }
        ]
    };

    // 更新题目导读内容
    const topicContent = document.querySelector('.topic-content');
    if (topicContent) {
        let html = '<h3>分析结果：</h3>';
        analysis.sections.forEach(section => {
            html += `<div class="point">${section.title}：${section.content}</div>`;
        });
        topicContent.innerHTML = html;
    }
}

// 初始化大纲助手
function initOutlineAssistant() {
    const chatContainer = document.querySelector('.chat-container');
    const confirmButton = document.querySelector('.btn-confirm');
    
    if (chatContainer && confirmButton) {
        // 添加初始AI消息
        addMessage('agent', '你好！我是你的大纲助手。让我们一起来完成大纲创作。根据题目导读的分析，你觉得这篇文章的主要论点应该是什么？');
        
        // 监听确认按钮点击
        confirmButton.addEventListener('click', function() {
            // 跳转到作文工作台
            const writingPlatform = document.querySelector('[data-page="writing-platform"]');
            if (writingPlatform) {
                writingPlatform.click();
            }
        });
    }
}

// 添加消息到聊天区域
function addMessage(type, content) {
    const messagesContainer = document.querySelector('.chat-messages');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = type === 'agent' ? 'AI' : '我';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 初始化作文工作台
function initWritingPlatform() {
    // 初始化AI优化按钮
    const optimizeButtons = document.querySelectorAll('.btn-optimize');
    optimizeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const textarea = this.previousElementSibling;
            const content = textarea.value.trim();
            if (content) {
                // TODO: 调用AI优化接口
                console.log('优化内容:', content);
            }
        });
    });

    // 初始化AI打分按钮
    const btnScore = document.querySelector('.btn-score');
    if (btnScore) {
        btnScore.addEventListener('click', function() {
            // TODO: 实现AI打分功能
            console.log('AI打分');
        });
    }

    // 初始化保存按钮
    const btnSave = document.querySelector('.btn-save');
    if (btnSave) {
        btnSave.addEventListener('click', function() {
            // TODO: 实现保存功能
            console.log('保存作文');
        });
    }
}

// 初始化笔记页面
function initNotesPage() {
    // 初始化笔记标签页
    const notesTabs = document.querySelectorAll('.notes-tab');
    notesTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有active类
            notesTabs.forEach(t => t.classList.remove('active'));
            // 添加当前active类
            this.classList.add('active');
            // 切换内容
            const tabId = this.getAttribute('data-tab');
            switchNotesTab(tabId);
        });
    });

    // 初始化表格数据
    updateSentencesTable();
    updateEssaysTable();
}

// 切换笔记标签页内容
function switchNotesTab(tabId) {
    const notesContents = document.querySelectorAll('.notes-content');
    notesContents.forEach(content => {
        content.classList.remove('active');
    });
    const targetContent = document.getElementById(tabId);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

// 更新句子表格
function updateSentencesTable() {
    const tbody = document.querySelector('.sentences-table tbody');
    if (!tbody) return;

    // 从localStorage获取数据
    const sentences = JSON.parse(localStorage.getItem('sentences') || '[]');
    
    // 清空表格
    tbody.innerHTML = '';
    
    // 添加数据行
    sentences.forEach((sentence, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${sentence.content}</td>
            <td>
                <button class="btn-edit" data-id="${sentence.id}">编辑</button>
                <button class="btn-delete" data-id="${sentence.id}">删除</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // 添加事件监听
    tbody.addEventListener('click', function(e) {
        const target = e.target;
        if (target.classList.contains('btn-edit')) {
            handleEdit(target.getAttribute('data-id'));
        } else if (target.classList.contains('btn-delete')) {
            handleDelete(target.getAttribute('data-id'));
        }
    });
}

// 更新作文表格
function updateEssaysTable() {
    const tbody = document.querySelector('.essays-table tbody');
    if (!tbody) return;

    // 从localStorage获取数据
    const essays = JSON.parse(localStorage.getItem('essays') || '[]');
    
    // 清空表格
    tbody.innerHTML = '';
    
    // 添加数据行
    essays.forEach((essay, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${essay.title}</td>
            <td>${essay.createTime}</td>
            <td>
                <button class="btn-view" data-id="${essay.id}">查看</button>
                <button class="btn-delete" data-id="${essay.id}">删除</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // 添加事件监听
    tbody.addEventListener('click', function(e) {
        const target = e.target;
        if (target.classList.contains('btn-view')) {
            handleView(target.getAttribute('data-id'));
        } else if (target.classList.contains('btn-delete')) {
            handleDelete(target.getAttribute('data-id'));
        }
    });
}

// 处理编辑操作
function handleEdit(id) {
    // TODO: 实现编辑功能
    console.log('编辑ID:', id);
}

// 处理删除操作
function handleDelete(id) {
    // TODO: 实现删除功能
    console.log('删除ID:', id);
}

// 处理查看操作
function handleView(id) {
    // TODO: 实现查看功能
    console.log('查看ID:', id);
}

// 作文题目数据
const essayTopics = {
    小作文: {
        '2023': [
            {
                id: '2023-1',
                title: '图表写作：公园数量增长趋势',
                type: '图表写作',
                content: '请根据下面的图表和图片，分析居民对自身身体素质的关注程度。要求：\n1. 描述图片中的场景和图表数据\n2. 分析数据反映的社会现象\n3. 总结这种变化带来的影响'
            },
            {
                id: '2023-2',
                title: '图表写作：城市绿化覆盖率',
                type: '图表写作',
                content: '请根据下面的数据，分析某市近年来的城市绿化发展情况。要求：\n1. 描述绿化覆盖率的变化趋势\n2. 分析变化原因\n3. 展望未来发展'
            }
        ],
        '2022': [
            {
                id: '2022-1',
                title: '图表写作：居民健康意识调查',
                type: '图表写作',
                content: '根据以下数据，分析居民的健康意识变化情况。要求：\n1. 描述调查数据的主要特点\n2. 分析变化原因\n3. 提出建议'
            }
        ]
    },
    大作文: {
        '2023': [
            {
                id: '2023-a',
                title: '议论文：科技与人文',
                type: '议论文',
                content: '在科技快速发展的今天，如何处理好科技发展与人文关怀的关系？请就此问题展开讨论。'
            },
            {
                id: '2023-b',
                title: '议论文：教育与创新',
                type: '议论文',
                content: '创新教育对于国家发展的重要性是什么？请结合实际谈谈你的看法。'
            }
        ],
        '2022': [
            {
                id: '2022-a',
                title: '议论文：环境与发展',
                type: '议论文',
                content: '如何在发展经济的同时保护好环境？请谈谈你的观点。'
            }
        ]
    }
}; 