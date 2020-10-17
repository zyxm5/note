function use(Vue){
    Vue.use = function(plugin){
        const installedPlugins = this.installedPlugins || []; 
        // 只安装一次
        if(installedPlugins.indexOf(plugin) > -1){
            return this;
        }
        // 收集参数
        const args = [...arguments];
        args.unshift(this);
        // 判断是否有install方法
        if(typeof plugin.install === 'function'){
            plugin.install.apply(plugin, args)
        }else if(typeof plugin === 'function'){
            plugin.apply(null, args);
        }
        // 记录已经安装的plugin
        this.installedPlugins.push(plugin);
        return this;
    }
}