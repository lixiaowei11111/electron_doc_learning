const path=require("path")

module.exports = {
  packagerConfig: {
    name: "GithubDesktop",// 自定义应用名称
    icon: path.join(__dirname,"./assets/GITHUB_.ico"),// 自定义应用icon,需要为ico格式
    asar: true,
    osxSign: {},
    //...
    osxNotarize: {
      tool: "notarytool",
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
    },
  },
  // os下的分发设置
  rebuildConfig: {},
  makers: [
    // windows
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        certificateFile: "./cert.pfx",
        certificatePassword: process.env.CERTIFICATE_PASSWORD, // window下的应用`程序签名
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
};
