
describe("X-Tag's setup should", function() {

  it("import its globals into the environment", function() {
    expect(xtag).toBeDefined();
    expect(XTagElement).toBeDefined();
  });

});

describe("X-Tag extension API should", function() {

  it("load global extensions when included in component declarations via string reference", function() {

    count = 0;
    xtag.extensions.foo = {
      mixin: (base) => class extends base {
        bar(){
          count++;
        }
      },
      onParse (){
        count++;
      },
      onCompiled (){
        count++;
      },
      onConstruct (){
        count++;
      }
    }

    var component = xtag.create(class extends XTagElement.extensions('foo') {
      'baz::foo'(){ count++; }
    });

    defineTestElement(component);

    var node = new component();
    node.bar();
    node.baz();

    expect(count).toBe(5);

    delete xtag.extensions.foo;
  });

  it("load local extensions when included in component declarations directly", function() {

    count = 0;
    var foo = {
      name: 'foo',
      mixin: (base) => class extends base {
        bar(){
          count++;
        }
      },
      onParse (){
        count++;
      },
      onCompiled (){
        count++;
      },
      onConstruct (){
        count++;
      }
    }

    var baz = {
      name: 'baz',
      mixin: (base) => class extends base {
        boo(){
          count++;
        }
      }
    }

    var _comp = class extends XTagElement.extensions(foo, baz) {
      'zul::foo'(){ count++; }
    }

    var component = xtag.create(_comp);

    defineTestElement(component);

    var node = new component();
    node.bar();
    node.zul();
    node.boo();
    
    expect(count).toBe(6);
  });

});

describe("X-Tag's attr extension should", function() {

  it("correctly parse keys and set descriptors", function() {

    var count = 0;
    var foo = xtag.create(class extends XTagElement {
      'one::attr'(){ count++; }
      set 'two::attr'(val){ count++; }
      get 'three::attr'(){ count++; }
    });

    defineTestElement(foo);

    expect('one' in foo.prototype).toBe(true);
    expect('two' in foo.prototype).toBe(true);
    expect('three' in foo.prototype).toBe(true);

    var node = new foo();
    node.one = 'test';
    node.two = 'test';
    node.three;

    expect('three' in foo.prototype).toBe(true);

  });

  it("call all descriptor variants", function() {

    var count = 0;
    var foo = xtag.create(class extends XTagElement {
      'one::attr'(){ count++; }
      set 'two::attr'(val){ count++; }
      get 'three::attr'(){ count++; }
      'four::attr'(){ count++; }
      get 'four::attr'(){ count++; }
      set 'five::attr'(val){ count++; }
      get 'five::attr'(){ count++; }
      get 'six::attr'(){
        return Number(this.getAttribute('six'));
      }
    });

    defineTestElement(foo);

    var node = new foo();
    node.one = 'test';
    node.two = 'test';
    node.three;
    node.four = 'test';
    node.four;
    node.five = 'test';
    node.five;
    node.six = 6;

    expect(count).toBe(7);
    expect(node.one).toBe('test');
    expect(node.getAttribute('one')).toBe('test');
    expect(node.two).toBe('test');
    expect(node.getAttribute('two')).toBe('test');
    expect(node.three).toBe(null);
    expect(node.getAttribute('three')).toBe(null);
    expect(node.four).toBe('test');
    expect(node.getAttribute('four')).toBe('test');
    expect(node.five).toBe('test');
    expect(node.getAttribute('five')).toBe('test');
    expect(node.six).toBe(6);
    expect(node.getAttribute('six')).toBe('6');

  });

  it("correctly handles boolean attributes", function() {

    var count = 0;
    var foo = xtag.create(class extends XTagElement {
      'one::attr(boolean)'(){ count++; }
      set 'two::attr(boolean)'(val){
        count++;
        return 'bar';
      }
      get 'three::attr(boolean)'(){ count++; }
    });

    defineTestElement(foo);

    var node = new foo();
    node.one = 'test';
    node.two = 'test';
    node.three = 'test';
    node.three;

    expect(count).toBe(3);
    expect(node.hasAttribute('one')).toBe(true);
    expect(node.getAttribute('one')).toBe('');
    expect(node.hasAttribute('two')).toBe(true);
    expect(node.getAttribute('two')).toBe('');
    expect(node.hasAttribute('three')).toBe(true);
    expect(node.getAttribute('three')).toBe('');

  });

});

describe("X-Tag's event extension should", function() {

  it("attach all subevents", function(done) {
    
    var count = 0;
    xtag.events.loaded = {
      attach: ['load'],
      onFilter (node, event, data, resolve) {
        if (event.type == 'load') {
          count++;
          resolve();
        }
      }
    }

    var foo = xtag.create(class extends XTagElement {
      constructor(){
        super();
        var img = document.createElement('img');
        img.src = 'assets/bitcoin.png';
        this.appendChild(img);
      }
      'loaded::event'(){
        count++;
        expect(count).toBe(2);
        done();
      }
    });

    defineTestElement(foo);

    var node = new foo();
    
  });

});