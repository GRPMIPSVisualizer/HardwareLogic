### 1.Naming Convention命名规范

1. 项目名全部小写 The name of project should all be in lower case
2. 包名全部小写 The name of project should all be in lower case。点分隔符之间有且仅有一个自然语义的英语单词。包名统一使用 单数形式，但是类名如果有复数含义，类名可以使用复数形式。 
3. 类名首字母大写，若类名由多个单词构成，每个单词首字母大写，即驼峰命名法 Camel Naming Convention
4. 变量名、方法名首字母小写，若其由多个单词构成，每个单词首字母大写，即小驼峰命名法
5. 常量名全部大写
   * PI = 3.14
6. 名称只能由数字、字母、下划线、$符组成，不能以数字开头
7. 不要使用拼音 或者 英语掺杂拼音（如：StudentDianHua || MyHomeDiZhi 等）
8. 抽象类命名使用Abstract或Base开头；异常类命名使用Exception 结尾；测试类 命名以它要测试的类的名称开始，以Test结尾。 
9. 类型与中括号紧挨相连来表示数组。
   * 定义整形数组 int[] arrayDemo。不是 int arrayDemo[]

### 2.常量定义

1. 如果变量值仅在一个固定范围内变化用enum类型来定义

   ```java
   public enum SeasonEnum {     
   	SPRING(1), SUMMER(2), AUTUMN(3), WINTER(4);     
       private int seq;
       SeasonEnum(int seq) {  
           this.seq = seq;     
           }     
       public int getSeq() {
       	return seq;     
       } 
   } 
   ```

2. 不允许任何魔法值Magic value

3. long或者Long赋值时，数值后使用大写字母L，不能是小写字母l，小写容易跟 数字混淆，造成误解。 

   * 说明：Long a = 2l; 写的是数字的 21，还是Long 型的 2?

### 3.代码格式

1. 如果是大括号内为空，则简洁地写成{}即可，大括号中间无需换行和空格；如果是非 空代码块则：  1） 左大括号前不换行。  2） 左大括号后换行。  3） 右大括号前换行。  4） 右大括号后还有 else 等代码则不换行；表示终止的右大括号后必须换行。 

2. 左小括号和右边相邻字符之间不出现空格；右小括号和左边相邻字符之间也不出现空 格；而左大括号前需要加空格。

3. if/for/while/switch/do 等保留字与括号之间都必须加空格。

4. 任何二目、三目运算符的左右两边都需要加一个空格。 

   * 说明：包括赋值运算符=、逻辑运算符&&、加减乘除符号等。 

5. 采用4个空格缩进，禁止使用Tab字符。 说明：如果使用 Tab 缩进，必须设置 1个 Tab为4 个空格。

   ```java
   public static void main(String[] args) {     
       // 缩进4个空格
       String say = "hello";
       // 运算符的左右必须有一个空格
       int flag = 0;
       // 关键词if与括号之间必须有一个空格，括号内的f 与左括号，0与右括号不需要空格     
       if (flag == 0) {         
           System.out.println(say);
       }
       // 左大括号前加空格且不换行；左大括号后换行
       if (flag == 1) {
       	System.out.println("world");
       	// 右大括号前换行，右大括号后有else，不用换行
       } else {
           System.out.println("ok");
           // 在右大括号后直接结束，则必须换行     
       } 
   } 
   ```

6. 注释的双斜线与注释内容之间有且仅有一个空格。 

   * // 这是示例注释，请注意在双斜线之后有一个空格 

7. 在进行类型强制转换时，右括号与强制转换值之间不需要任何空格隔开。 

   * double first = 3.2d; int second = (int)first + 2; 

8. 单行字符数限制不超过120个，超出需要换行，换行时遵循如下原则：  

   1）第二行相对第一行缩进4 个空格，从第三行开始，不再继续缩进，参考示例。 

   2）运算符与下文一起换行。  

   3）方法调用的点符号与下文一起换行。  

   4）方法调用中的多个参数需要换行时，在逗号后进行。  

   5）在括号前不要换行，见反例。 

   * 正例： 

     ```java
     StringBuilder sb = new StringBuilder();
     // 超过120个字符的情况下，换行缩进4个空格，并且方法前的点号一起换行  
     sb.append("yang").append("hao")...
         .append("chen")...
         .append("chen")...
         .append("chen");
     
     反例： StringBuilder sb = new StringBuilder(); 
     // 超过120个字符的情况下，不要在括号前换行 
     sb.append("you").append("are")...append
         ("lucky"); 
     // 参数很多的方法调用可能超过120个字符，逗号后才是换行处  method(args1, args2, args3, ...     , argsX); 
     ```

9. 方法参数在定义和传入时，多个参数逗号后面必须加空格。 

   * method(args1, args2, args3); 

