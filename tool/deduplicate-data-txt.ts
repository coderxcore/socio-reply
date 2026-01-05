import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件所在的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义data目录的路径
const dataDir = path.join(__dirname, '../src/background/data');

/**
 * 对单个.txt文件进行去重和排序操作
 */
function deduplicateFile(filePath: string): void {
  try {
    // 读取文件内容
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 分割成行数组，去除空行
    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    // 使用Set进行去重
    const uniqueLines = [...new Set(lines)];
    
    // 对去重后的词汇进行排序
    uniqueLines.sort((a, b) => {
        // 对于中文文件使用localeCompare排序
        if (filePath.includes('zh.txt')) {
            return a.localeCompare(b, 'zh-CN');
        }
        // 其他语言使用默认排序
        return a.localeCompare(b);
    });
    
    // 重新写入文件
    fs.writeFileSync(filePath, uniqueLines.join('\n'), 'utf8');
    
    // 输出去重结果
    console.log(`✅ 已处理 ${filePath}`);
    console.log(`   - 原行数: ${lines.length}`);
    console.log(`   - 去重后行数: ${uniqueLines.length}`);
    console.log(`   - 移除重复数: ${lines.length - uniqueLines.length}`);
  } catch (error) {
    console.error(`❌ 处理文件 ${filePath} 时出错:`, error);
  }
}

/**
 * 递归遍历目录，找到所有.txt文件并进行去重操作
 */
function recursivelyDeduplicateFiles(directory: string): void {
  try {
    // 读取目录内容
    const files = fs.readdirSync(directory, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(directory, file.name);
      
      if (file.isDirectory()) {
        // 如果是目录，递归处理
        recursivelyDeduplicateFiles(fullPath);
      } else if (file.isFile() && path.extname(file.name) === '.txt') {
        // 如果是.txt文件，进行去重操作
        deduplicateFile(fullPath);
        console.log('-' .repeat(50));
      }
    }
  } catch (error) {
    console.error(`❌ 遍历目录 ${directory} 时出错:`, error);
  }
}

/**
 * 对data目录下所有.txt文件进行去重操作
 */
function deduplicateAllTxtFiles(): void {
  console.log('开始对data目录下所有.txt文件进行去重和排序操作...');
  console.log('='.repeat(50));
  
  // 递归处理data目录下的所有.txt文件
  recursivelyDeduplicateFiles(dataDir);
  
  console.log('所有.txt文件处理完成! 🎉');
}

// 执行去重操作
deduplicateAllTxtFiles();
