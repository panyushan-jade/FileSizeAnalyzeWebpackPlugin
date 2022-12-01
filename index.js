const chalk = require('chalk');
const boxen = require('boxen');


const getfilesize = (size) => {
    if (!size)
        return "";
    var num = 1024.00; //byte
    if (size < num)
        return size + "B";
    if (size < Math.pow(num, 2))
        return (size / num).toFixed(2) + "KB"; //kb
    if (size < Math.pow(num, 3))
        return (size / Math.pow(num, 2)).toFixed(2) + "M"; //M
    if (size < Math.pow(num, 4))
        return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
    return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
}

class FileSizeFileSizeAnalyzeWebpackPlugin {
    constructor(){
        this.content = ''
    }
    done = () => {
        // 未了避免webpack打包完成的一些信息 把log给挤上去 延迟执行
        setTimeout(() => {
            console.log(boxen(this.content,{padding: 1, margin: 1, borderStyle: 'double',borderColor:'#fd6dc0'}));
        },30)
    }
    apply(compiler){
        compiler.hooks.emit.tapAsync('FileSizeAnalyzeWebpackPlugin', (compilation, callback)=>{
            const packFilesLen = Object.keys(compilation.assets).length
            let num = 0;
            this.content = `📊本次构建结果统计：\n生成文件数量：${packFilesLen}个;\n`;
            for (let filename in compilation.assets) {
                const fileSize = getfilesize(compilation.assets[filename].size())
                const isBigSizeFile = fileSize.includes('M' || 'G' || 'T')
                if(isBigSizeFile) num++
                this.content += `文件名称:${chalk.green(filename)}，文件大小:${ isBigSizeFile ? chalk.red(fileSize) : chalk.green(fileSize)};\n`;
            }
            const start = this.content.split('文件名称')[0].length
            this.content = `${this.content.slice(0,start)}生成大文件数量：${chalk.red(num)}个 建议优化🔥;\n${this.content.slice(start)}`
            callback()
        })
        // 监听打包结束 输出log
        compiler.hooks.done.tap('FileSizeAnalyzeWebpackPluginDone',this.done)
    }
}

module.exports = FileSizeFileSizeAnalyzeWebpackPlugin