<!--
 * @Description: 
 * @Autor: tianzhen
 * @Date: 2021-05-22 11:07:56
 * @LastEditors: Set Name
 * @LastEditTime: 2021-08-13 14:50:05
-->
<template>
  <div id="app">
    <div id="nav">
      <h2>融合平台设计器</h2>
      <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> -->
    </div>
    <router-view/>
  </div>
</template>

<style lang="less">
html,body{
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
