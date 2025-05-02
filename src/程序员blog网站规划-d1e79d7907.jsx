import React, { useState, useEffect } from 'react';
import { 
  Code, 
  FileText, 
  BookOpen, 
  Terminal, 
  GitBranch,
  Database,
  Cpu,
  Server,
  Network,
  Layers,
  BarChart2,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Search,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProgrammerBlog = () => {
  const [activeTab, setActiveTab] = useState('python');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    python: true,
    java: false,
    cpp: false,
    newFeatures: false,
    projectExp: false,
    industryNews: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const programmingTips = {
    python: [
      {
        title: "利用生成器优化内存使用",
        content: "生成器是Python中强大但常被忽视的特性，允许在不占用大量内存的情况下处理大型数据集。例如处理包含数百万条记录的日志文件，使用传统列表方法可能导致内存溢出，而生成器可以逐行处理文件，节省内存并提高处理速度。",
        code: `def process_large_file(file_path):
    with open(file_path, 'r') as file:
        for line in file:
            if 'ERROR' in line:
                yield line.strip()

for error_line in process_large_file('huge_log.txt'):
    print(error_line)`
      },
      {
        title: "装饰器：代码复用的艺术",
        content: "装饰器允许修改或增强函数的行为而不改变其源代码，在日志记录、性能测量和访问控制等方面特别有用。",
        code: `import time
from functools import wraps

def timing_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} 执行时间: {end_time - start_time:.4f} 秒")
        return result
    return wrapper

@timing_decorator
def complex_calculation(n):
    return sum(i**2 for i in range(n))`
      }
    ],
    java: [
      {
        title: "利用三元表达式",
        content: "可简化条件判断语句，避免定义中间变量。",
        code: `String title = isMember(phone) ? "会员" : "游客";`
      },
      {
        title: "利用try-with-resource语句",
        content: "所有实现Closeable接口的'资源'，均可采用该语句进行简化，确保资源在操作完成后正确关闭。",
        code: `try (BufferedReader reader = new BufferedReader(new FileReader("test.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        // 处理line
    }
} catch (IOException e) {
    log.error("读取文件异常", e);
}`
      }
    ],
    cpp: [
      {
        title: "VSCode环境搭建与初始化配置",
        content: "选择合适的集成开发环境(IDE)是提高开发效率的关键，Visual Studio Code(VSCode)以其轻量、高效、跨平台的特点受到众多开发者青睐。"
      },
      {
        title: "C/C++项目的基础调试技巧",
        content: "包括调试环境的搭建、调试工具的选择与设置、代码优化和性能分析等。"
      }
    ]
  };

  const newFeatures = {
    python: [
      "解释器的改进",
      "对Python数据模型的改进",
      "标准库中的重大改进",
      "安全改进",
      "C API的改进"
    ],
    java: [
      "JEP 455: 模式中的原始类型、instanceof和switch(预览)",
      "JEP 456: 类文件API(第二次预览)",
      "JEP 467: Markdown文档注释",
      "JEP 469: 向量API(第八次孵化)"
    ],
    cpp: [
      "C++11新特性",
      "C++14新特性",
      "C++17新特性",
      "C++20新特性",
      "C++23新特性"
    ]
  };

  const projectExperience = [
    {
      title: "程序员简历项目经历撰写原则",
      points: [
        "真实性: 项目经历要真实，自己真的做过这些项目",
        "相关性: 只写自己参与的部分",
        "条理性: 分点叙述，条理清晰"
      ]
    },
    {
      title: "项目经验介绍要点",
      points: [
        "应包括项目背景、自己的职责、解决的问题和克服的难点",
        "用数据说话，提供量化的数据说明",
        "介绍2到3个重点项目即可"
      ]
    }
  ];

  const industryNews = [
    {
      title: "编程杂志推荐",
      items: [
        "《Wired》: 报道最新科技、未来趋势、新兴科技企业",
        "《Smashing Magazine》: 为网站设计师和开发者提供技术动态",
        "《ACM Communications》: 计算机科学和工程领域的权威出版物"
      ]
    },
    {
      title: "程序员常用的IT资讯网站",
      items: [
        "电脑爱好者",
        "阿里研究院",
        "松松网",
        "投资界",
        "i黑马",
        "机器之心"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Terminal className="text-blue-600" size={24} />
            <h1 className="text-xl font-bold text-gray-800">程序员技术博客</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
              <button 
                onClick={() => setActiveTab('tips')}
                className={`${activeTab === 'tips' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-500 transition-colors`}
              >
                编程技巧
              </button>
              <button 
                onClick={() => setActiveTab('features')}
                className={`${activeTab === 'features' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-500 transition-colors`}
              >
                新特性
              </button>
              <button 
                onClick={() => setActiveTab('projects')}
                className={`${activeTab === 'projects' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-500 transition-colors`}
              >
                项目经验
              </button>
              <button 
                onClick={() => setActiveTab('news')}
                className={`${activeTab === 'news' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-500 transition-colors`}
              >
                行业动态
              </button>
            </nav>
            
            <div className="relative">
              <input
                type="text"
                placeholder="搜索文章..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
          </div>
          
          <button 
            className="md:hidden text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white border-t border-gray-200 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索文章..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                </div>
                
                <nav className="flex flex-col space-y-2">
                  <button 
                    onClick={() => {
                      setActiveTab('tips');
                      setMobileMenuOpen(false);
                    }}
                    className={`${activeTab === 'tips' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'} px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left`}
                  >
                    编程技巧
                  </button>
                  <button 
                    onClick={() => {
                      setActiveTab('features');
                      setMobileMenuOpen(false);
                    }}
                    className={`${activeTab === 'features' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'} px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left`}
                  >
                    新特性
                  </button>
                  <button 
                    onClick={() => {
                      setActiveTab('projects');
                      setMobileMenuOpen(false);
                    }}
                    className={`${activeTab === 'projects' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'} px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left`}
                  >
                    项目经验
                  </button>
                  <button 
                    onClick={() => {
                      setActiveTab('news');
                      setMobileMenuOpen(false);
                    }}
                    className={`${activeTab === 'news' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'} px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left`}
                  >
                    行业动态
                  </button>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'tips' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold flex items-center">
              <Code className="mr-2 text-blue-600" size={24} />
              编程语言技巧分享
            </h2>
            
            {/* Python Tips */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button 
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection('python')}
              >
                <div className="flex items-center">
                  <FileText className="mr-3 text-blue-600" size={20} />
                  <span className="font-medium">Python技巧</span>
                </div>
                {expandedSections.python ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </button>
              
              <AnimatePresence>
                {expandedSections.python && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 space-y-6">
                      {programmingTips.python.map((tip, index) => (
                        <div key={index} className="space-y-4">
                          <h3 className="text-lg font-medium">{tip.title}</h3>
                          <p className="text-gray-700">{tip.content}</p>
                          {tip.code && (
                            <div className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
                              <pre className="whitespace-pre-wrap">{tip.code}</pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Java Tips */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button 
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection('java')}
              >
                <div className="flex items-center">
                  <FileText className="mr-3 text-blue-600" size={20} />
                  <span className="font-medium">Java技巧</span>
                </div>
                {expandedSections.java ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </button>
              
              <AnimatePresence>
                {expandedSections.java && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 space-y-6">
                      {programmingTips.java.map((tip, index) => (
                        <div key={index} className="space-y-4">
                          <h3 className="text-lg font-medium">{tip.title}</h3>
                          <p className="text-gray-700">{tip.content}</p>
                          {tip.code && (
                            <div className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
                              <pre className="whitespace-pre-wrap">{tip.code}</pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* C++ Tips */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button 
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection('cpp')}
              >
                <div className="flex items-center">
                  <FileText className="mr-3 text-blue-600" size={20} />
                  <span className="font-medium">C++技巧</span>
                </div>
                {expandedSections.cpp ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </button>
              
              <AnimatePresence>
                {expandedSections.cpp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 space-y-6">
                      {programmingTips.cpp.map((tip, index) => (
                        <div key={index} className="space-y-4">
                          <h3 className="text-lg font-medium">{tip.title}</h3>
                          <p className="text-gray-700">{tip.content}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
        
        {activeTab === 'features' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold flex items-center">
              <GitBranch className="mr-2 text-blue-600" size={24} />
              编程语言新特性
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Python Features */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-medium flex items-center">
                    <FileText className="mr-2 text-blue-600" size={18} />
                    Python 3.13
                  </h3>
                </div>
                <div className="px-6 py-4 space-y-3">
                  {newFeatures.python.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="mt-1 mr-2 text-green-500 flex-shrink-0" size={16} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Java Features */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-medium flex items-center">
                    <FileText className="mr-2 text-blue-600" size={18} />
                    Java 22 & 23
                  </h3>
                </div>
                <div className="px-6 py-4 space-y-3">
                  {newFeatures.java.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="mt-1 mr-2 text-green-500 flex-shrink-0" size={16} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* C++ Features */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-medium flex items-center">
                    <FileText className="mr-2 text-blue-600" size={18} />
                    C++ 11-23
                  </h3>
                </div>
                <div className="px-6 py-4 space-y-3">
                  {newFeatures.cpp.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="mt-1 mr-2 text-green-500 flex-shrink-0" size={16} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold flex items-center">
              <Database className="mr-2 text-blue-600" size={24} />
              项目开发经验
            </h2>
            
            <div className="space-y-6">
              {projectExperience.map((exp, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-medium mb-4">{exp.title}</h3>
                  <ul className="space-y-3">
                    {exp.points.map((point, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="mt-1 mr-2 text-green-500 flex-shrink-0" size={16} />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'news' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold flex items-center">
              <BookOpen className="mr-2 text-blue-600" size={24} />
              行业动态资讯
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {industryNews.map((news, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-medium">{news.title}</h3>
                  </div>
                  <div className="px-6 py-4 space-y-3">
                    {news.items.map((item, i) => (
                      <div key={i} className="flex items-start">
                        <CheckCircle className="mt-1 mr-2 text-green-500 flex-shrink-0" size={16} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>created by <a href="https://space.coze.cn" className="text-blue-600 hover:underline">coze space</a> · 页面内容均由 AI 生成，仅供参考</p>
        </div>
      </footer>
    </div>
  );
};

export default ProgrammerBlog;