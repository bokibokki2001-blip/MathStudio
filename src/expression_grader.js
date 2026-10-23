/* MathStudio: offline symbolic equivalence PoC v0.1.2. No eval / network / dependencies. */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MathStudioGrader = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const MAX_INPUT = 1000, MAX_TOKENS = 300, MAX_TERMS = 2000, MAX_EXP = 16, MAX_DIGITS = 18;
  const fail = (message, code='unsupported') => { const e=new Error(message); e.code=code; throw e; };
  const norm = s => String(s).replace(/[０-９]/g,c=>String(c.charCodeAt(0)-65296))
    .replace(/[＋]/g,'+').replace(/[－−]/g,'-').replace(/[×＊]/g,'*').replace(/[÷／]/g,'/').replace(/[（]/g,'(').replace(/[）]/g,')').replace(/[＝]/g,'=')
    .replace(/\r/g,'').trim();
  const numKey = s => {let t=String(s); if (!/^\d+(?:\.\d+)?$/.test(t)) fail('数字の形式が未対応');
    if (t.replace(/\D/g,'').length>MAX_DIGITS) fail('数値が大きすぎます');
    let [a,b='']=t.split('.'); a=a.replace(/^0+(?=\d)/,''); b=b.replace(/0+$/,''); return b ? a+'.'+b : a; };
  function parse(src) {
    src=norm(src); if (src.length>MAX_INPUT) fail('入力が長すぎます');
    const toks=src.match(/\d+(?:\.\d+)?|[a-zA-Z_][a-zA-Z_0-9]*|[()+\-*/]|\S/g)||[];
    if(toks.length>MAX_TOKENS) fail('式が長すぎます');
    let i=0;
    function primary(depth) {
      if(depth>MAX_EXP) fail('式の入れ子が深すぎます');
      const t=toks[i++];
      if(t==='('){let a=add(depth+1); if(toks[i++]!==')') fail('閉じ括弧が必要です'); return a;}
      if(t==='-') return {kind:'neg',a:primary(depth+1)};
      if(t==='+') return primary(depth+1);
      if(t&&/^\d/.test(t)) return {kind:'number',value:numKey(t)};
      if(t&&/^[a-zA-Z_]/.test(t)) return {kind:'id',value:t};
      fail('式の読み取りに失敗しました');
    }
    function mul(depth){let a=primary(depth); while(toks[i]==='*'||toks[i]==='/'){
      const op=toks[i++]; a={kind:'op',op,a,b:primary(depth)}; }return a;}
    function add(depth){let a=mul(depth); while(toks[i]==='+'||toks[i]==='-'){
      const op=toks[i++]; a={kind:'op',op,a,b:mul(depth)};}return a;}
    const ast=add(0); if(i!==toks.length) fail('未対応の文字または式の構造です'); return ast;
  }
  const C=n=>new Map(n===0n?[]:[['',n]]);
  function monomialAdd(a,b) {const c={}; for(const s of [a,b])if(s)for(const p of s.split('|')){
    const [v,e]=p.split(':');c[v]=(c[v]||0)+Number(e);}
    return Object.keys(c).filter(k=>c[k]).sort().map(k=>k+':'+c[k]).join('|');}
  function pa(a,b,minus=false){const out=new Map(a); for(const [k,v] of b){const r=(out.get(k)||0n)+(minus?-v:v);if(r===0n)out.delete(k);else out.set(k,r);}return out;}
  function pm(a,b){const out=new Map();for(const [k,x]of a)for(const [l,y]of b){
    const key=monomialAdd(k,l),sum=(out.get(key)||0n)+x*y;
    if(sum===0n)out.delete(key);else out.set(key,sum);
    if(out.size>MAX_TERMS)fail('式が複雑すぎます');
  }return out;}
  const rat=(n,d)=>({n,d});
  const ra=(x,y,minus=false)=>rat(pa(pm(x.n,y.d),pm(y.n,x.d),minus),pm(x.d,y.d));
  const rm=(x,y)=>rat(pm(x.n,y.n),pm(x.d,y.d));
  const rd=(x,y)=>{if(y.n.size===0) fail('0で割る式です','invalid'); return rat(pm(x.n,y.d),pm(x.d,y.n));};
  function decimal(s) {let [a,b='']=s.split('.');return rat(C(BigInt(a+b)),C(10n**BigInt(b.length)));}
  const variable=k=>rat(new Map([[k+':1',1n]]),C(1n));
  function substitute(ast,env){
    if(ast.kind==='neg')return rm(rat(C(-1n),C(1n)),substitute(ast.a,env));
    if(ast.kind==='number') {
      if(Object.prototype.hasOwnProperty.call(env.aliases,ast.value))return substitute(env.aliases[ast.value],env);
      if(Object.prototype.hasOwnProperty.call(env.derived,ast.value)) return substitute(parse(env.derived[ast.value]),env);
      if(Object.prototype.hasOwnProperty.call(env.numericNames,ast.value)) {
        const ids=env.numericNames[ast.value]; if(ids.length!==1)fail('同じ値が複数の数量に使われています');return variable(ids[0]);
      }
      if(env.constants.includes(ast.value))return decimal(ast.value);
      fail('数値 '+ast.value+' は問題文・許可定数・確認済み途中式のいずれにもありません。数値を導いた途中式を示してください','invalid');
    }
    if(ast.kind==='id'){if(Object.prototype.hasOwnProperty.call(env.params,ast.value))return variable(ast.value); fail('未知の変数 '+ast.value);}
    const a=substitute(ast.a,env),b=substitute(ast.b,env);
    return ast.op==='+'?ra(a,b):ast.op==='-'?ra(a,b,true):ast.op==='*'?rm(a,b):rd(a,b);
  }
  // An identical printed number may represent two distinct quantities, for
  // example red=1 and blue=1. Enumerate possible symbolic bindings rather than
  // rejecting every equation containing repeated values. An assignment is
  // accepted ONLY when it yields the expected symbolic identity, not just the
  // correct numerical answer for the current values.
  // Cap alternatives to avoid exponential work from untrusted free-form input.
  const MAX_BINDINGS = 2048;
  function candidates(ast,env){
    if(ast.kind==='number'){
      if(Object.prototype.hasOwnProperty.call(env.aliases,ast.value))return candidates(env.aliases[ast.value],env);
      if(Object.prototype.hasOwnProperty.call(env.derived,ast.value))return candidates(parse(env.derived[ast.value]),env);
      if(Object.prototype.hasOwnProperty.call(env.numericNames,ast.value)){
        return env.numericNames[ast.value].map(variable);
      }
      if(env.constants.includes(ast.value))return [decimal(ast.value)];
      fail('数値 '+ast.value+' は問題文・許可定数・確認済み途中式のいずれにもありません。数値を導いた途中式を示してください','invalid');
    }
    if(ast.kind==='id')return [substitute(ast,env)];
    if(ast.kind==='neg')return candidates(ast.a,env).map(x=>rm(rat(C(-1n),C(1n)),x));
    const left=candidates(ast.a,env),right=candidates(ast.b,env);
    if(left.length*right.length>MAX_BINDINGS)fail('同じ数字が多いため、数量の対応を特定できません。別の書き方を試してください');
    const out=[];
    for(const a of left)for(const b of right){
      // The purely symbolic alternatives are small for generated word problems.
      out.push(ast.op==='+'?ra(a,b):ast.op==='-'?ra(a,b,true):ast.op==='*'?rm(a,b):rd(a,b));
    }
    return out;
  }
  function pv(p,values){let out=0n;for(const [k,c]of p){let term=c;
    if(k)for(const q of k.split('|')){const [v,e]=q.split(':');term*=BigInt(values[v])**BigInt(e);}
    out+=term;
  }return out;}
  function value(r,vals){const n=pv(r.n,vals),d=pv(r.d,vals);if(d===0n)fail('0で割る式です','invalid');return {n,d};}
  function equalFrac(a,b) {return a.n*b.d===b.n*a.d;}
  function equalRat(x,y) {return pm(x.n,y.d).size===pm(y.n,x.d).size && polyEqual(pm(x.n,y.d),pm(y.n,x.d));}
  function polyEqual(a,b){if(a.size!==b.size)return false;for(const [k,v]of a)if(b.get(k)!==v)return false;return true;}
  function result(status,detail,extra={}){return {status,detail,...extra};}
  function grade(problem,input) {
    try {
      if(typeof input!=='string'||!input.trim())return result('needs_review','数式を入力してください');
      const params=problem.params;
      const names={};for(const [k,v] of Object.entries(params)) {
        if(!Number.isSafeInteger(v)||v<0)fail('問題データの数値が未対応です');
        (names[String(v)] ||= []).push(k);
      }
      const env={params,numericNames:names,aliases:{},derived:problem.derived_literals||{},constants:(problem.allowed_constants||[]).map(String)};
      for(const [literal,formula] of Object.entries(env.derived)) {
        if(Object.prototype.hasOwnProperty.call(env.numericNames,numKey(literal)))fail('導出値が問題の数量と衝突します');
        const probe=substitute(parse(formula),{...env,derived:{},aliases:{}});
        const vals=Object.fromEntries(Object.entries(params).map(([k,v])=>[k,BigInt(v)]));
        if(!equalFrac(value(probe,vals),value(decimal(numKey(literal)),vals)))fail('導出値と式の対応が間違っています');
      }
      const expected=parse(problem.formula);
      const expectedR=substitute(expected,env); // problem.formula must use variable names
      const values=Object.fromEntries(Object.entries(params).map(([k,v])=>[k,BigInt(v)]));
      const expectedValue=value(expectedR,values);
      // An answer-only input must not be rejected merely because the answer is
      // not one of the story's source quantities. Compare it numerically first;
      // a correct final number without a derivation remains unverified.
      const answerOnly=norm(input);
      if(/^\d+(?:\.\d+)?$/.test(answerOnly)) {
        const match=equalFrac(value(decimal(numKey(answerOnly)),values),expectedValue);
        return match
          ? result('needs_review','答えは一致しますが、式がないため立式の妥当性を確認できません',{reason:'answer_only'})
          : result('incorrect','答えの数値が一致しません',{reason:'wrong_answer'});
      }
      const lines=norm(input).split(/\n+/).map(x=>x.trim()).filter(Boolean);
      if(lines.length>12)fail('途中式が多すぎます');
      let last=null;
      for(let i=0;i<lines.length;i++){
        const parts=lines[i].split('=');
        if(parts.length>2)fail('連続した等式にはまだ対応していません');
        const lhs=parse(parts[0]);
        const possible=candidates(lhs,env), leftR=possible[0];
        if(parts.length===2){
          const rhsText=parts[1].trim(),rhs=numKey(rhsText);
          const v=value(leftR,values),rhsV=value(decimal(rhs),values);
          if(!equalFrac(v,rhsV))return result('incorrect','途中式または答えの計算が一致しません',{line:i+1});
          if(i<lines.length-1){
            if(Object.prototype.hasOwnProperty.call(env.numericNames,rhs))return result('needs_review','途中結果の値が問題文の数値と重なるため判定を保留します',{line:i+1});
            env.aliases[rhs]=lhs; // one-step alias: recursively resolved via numeric names
          }
        }
        last=possible;
      }
      if(!last)return result('needs_review','式を入力してください');
      if(!equalFrac(value(last[0],values),expectedValue))return result('incorrect','今回の数値では正答になりません');
      // A single number with no quantity in formula is not evidence of valid construction.
      if(lines.length===1&&!/[+*/\-]/.test(lines[0].split('=')[0])) return result('needs_review','答えの数値だけでは立式の妥当性を確認できません');
      if(last.some(candidate=>equalRat(candidate,expectedR)))return result('correct','数量の値が同じ場合も、成立する立式を確認しました',{method:'symbolic_identity_with_quantity_bindings'});
      return result('incorrect','今回の答えは一致しますが、数量を変えると成立しない式です',{reason:'coincidental_answer'});
    }catch(e){return result(e.code==='invalid'?'incorrect':'needs_review',e.message,{reason:e.code||'unsupported'});}
  }
  return {grade,parse};
});
